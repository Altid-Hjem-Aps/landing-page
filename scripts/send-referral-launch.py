#!/usr/bin/env python3
"""Referral-launch blast: send 'referral-launch' til alle på ventelisten der
aldrig har fået deres personlige invite-link.

Målgruppe = Supabase `signup` hvor unsubscribed=false, der HAR en unsub_token
(uden afmeld-link sender vi ikke — lovkrav), er tilmeldt for mere end
FRESH_GRACE_H timer siden (helt nye får velkomstmailen automatisk af sitet),
OG hvis e-mail aldrig har modtaget en link-mail (hverken velkomstmailen
"Du er på ventelisten 🎉" eller denne launch-mail) ifølge Resends send-log
plus den lokale log. Bevidst politik: en velkomstmail der BOUNCEDE tæller
stadig som "har fået link" — vi gen-mailer ikke døde adresser.

Idempotent: hver batch sendes med en deterministisk Idempotency-Key, så
gentagne kørsler/netværksfejl aldrig kan dublere mails. Kør scriptet igen
efter en fejl, og det springer alle sendte over.

Kørsel:
    python3 send-referral-launch.py              # dry-run: viser tal, sender INTET
    python3 send-referral-launch.py --selftest   # kør indbygget logik-test (offline)
    python3 send-referral-launch.py --test MAIL  # send én testmail (via batch-API'et)
    python3 send-referral-launch.py --send       # send for alvor (kræver 'SEND')

Sender via Resends batch-API (100 pr. kald, ~0.7s pause — rate limit ~2/s)
med template-rendering på Resends side, som landing-sidens egen kode.
Persondata (modtagerliste + send-log) skrives til STATE_DIR i ~/Library —
IKKE i denne mappe, som ligger i iCloud Drive og synces til skyen.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import tempfile
import time
import unicodedata
from datetime import datetime, timedelta, timezone
from email.utils import parseaddr
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
# PII må ikke ligge i iCloud-synced mapper — log/targets bor i ~/Library.
STATE_DIR = os.path.expanduser('~/Library/Application Support/altid-dashboard')
TARGETS_FILE = os.path.join(STATE_DIR, 'launch-targets.json')
SENT_LOG = os.path.join(STATE_DIR, 'launch-sent-log.jsonl')

RESEND_API = 'https://api.resend.com'
RESEND_PAGE_SIZE = 100   # paginering af send-loggen (adskilt fra BATCH_SIZE)
SITE_URL = 'https://altidhjem.dk'
TEMPLATE_ALIAS = 'referral-launch'
FROM_EMAIL = 'Altid Hjem <hej@altidhjem.dk>'
BATCH_SIZE = 100         # Resend batch-endpoint max
SLEEP = 0.7
SANITY_MIN_LINKED = 50   # velkomstmailen har kørt siden 8. jun — færre match = noget er galt
FRESH_GRACE_H = 2        # nye tilmeldinger får link af sitet; undgå kapløb med velkomstmailen
WELCOME_LIVE_DATE = '2026-06-08'  # velkomst-med-link gik live denne dag
UUID_RE = re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
CURSOR_RE = re.compile(r'^[A-Za-z0-9_-]{1,64}$')
EMAIL_MASK = re.compile(r'[A-Za-z0-9._%+\'-]+@[A-Za-z0-9.-]+')


def norm_subject(s):
    """Robust emne-sammenligning: unicode-normaliseret, casefoldet, uden
    variation selectors — så en emoji-variant eller et mellemrum i templaten
    ikke lydløst slår dublet-værnet fra."""
    s = unicodedata.normalize('NFKC', s or '').replace('️', '')
    return ' '.join(s.split()).casefold()


# Emner der betyder "denne person HAR allerede fået sit invite-link".
# Kilder: Phase-2-velkomstmailen (landing-repoets send-email.ts) og selve
# launch-templaten 'referral-launch' i Resend. Ændres et emne dér, skal det
# rettes her — sanity-tjekket i fetch_already_linked fanger total-mismatch.
LINK_SUBJECTS = {
    norm_subject('Du er på ventelisten 🎉'),
    norm_subject('Du kan nu rykke frem i køen 🎉'),
}


def mask_pii(text):
    return EMAIL_MASK.sub('***@***', text or '')


class ClientError(RuntimeError):
    """Definitivt 4xx-afslag fra API'et — gentagelse hjælper ikke."""


def _cfg_value(v):
    """Escape en værdi til curls config-syntax. Kontroltegn afvises hårdt —
    en API-værdi med linjeskift må aldrig kunne tilføje curl-optioner."""
    if any(c in v for c in '\n\r\0'):
        raise ValueError('kontroltegn i curl-parameter')
    return v.replace('\\', '\\\\').replace('"', '\\"')


def curl(url, headers, method='GET', body=None, retries=3, idem_key=None):
    """curl med headers via en 0600-config-fil så nøgler aldrig står i `ps`.
    4xx (undtagen 429) kaster ClientError med det samme; andet retries.
    Fejltekster maskeres for e-mailadresser før de vises."""
    cfg = [f'url = "{_cfg_value(url)}"', 'fail-with-body', 'silent', 'show-error',
           'max-time = 60']
    for h in headers:
        cfg.append(f'header = "{_cfg_value(h)}"')
    if method != 'GET':
        cfg.append(f'request = "{method}"')
    if body is not None:
        cfg.append('header = "Content-Type: application/json"')
    if idem_key:
        cfg.append(f'header = "Idempotency-Key: {_cfg_value(idem_key)}"')
    body_bytes = body.encode('utf-8') if body is not None else None
    last_err = None
    for attempt in range(retries):
        fd, cfgpath = tempfile.mkstemp(suffix='.cfg')
        try:
            with os.fdopen(fd, 'w') as tf:
                tf.write('\n'.join(cfg) + '\n')
            args = ['curl', '--config', cfgpath]
            if body_bytes is not None:
                args += ['--data-binary', '@-']
            p = subprocess.run(args, input=body_bytes, capture_output=True, timeout=90)
            stdout = p.stdout.decode('utf-8', 'replace')
            stderr = p.stderr.decode('utf-8', 'replace')
            if p.returncode == 0 and stdout.strip():
                return json.loads(stdout)
            last_err = mask_pii((stderr or stdout or 'tomt svar').strip()[:300])
            m = re.search(r'returned error: (\d{3})', stderr)
            if m and 400 <= int(m.group(1)) < 500 and int(m.group(1)) != 429:
                raise ClientError(f'HTTP {m.group(1)}: {last_err}')
        except ClientError:
            raise
        except Exception as e:  # noqa: BLE001
            last_err = last_err or type(e).__name__
        finally:
            os.unlink(cfgpath)
        if attempt < retries - 1:
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f'curl fejlede efter {retries} forsøg: {last_err}')


def load_env():
    """Hemmeligheder fra ./.env (team-opsætning) ellers landing-repoets .env.local."""
    env = {}
    for path in (os.path.join(HERE, '.env'),
                 os.path.expanduser('~/Developer/altidhjem/landing-page/.env.local')):
        if not os.path.exists(path):
            continue
        for line in open(path):
            line = line.strip()
            if line and not line.startswith('#') and '=' in line:
                k, v = line.split('=', 1)
                env.setdefault(k.strip(), v.strip().strip('"').strip("'"))
    if not env.get('RESEND_API_KEY'):
        # Samme fallback som serve.py: nøglen fra Resend-MCP-opsætningen
        try:
            cj = json.load(open(os.path.expanduser('~/.claude.json')))
            env['RESEND_API_KEY'] = cj['mcpServers']['resend']['env']['RESEND_API_KEY']
        except (OSError, KeyError, json.JSONDecodeError):
            pass
    missing = [k for k in ('SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'RESEND_API_KEY') if not env.get(k)]
    if missing:
        sys.exit(f'Mangler nøgler: {missing} (tjek .env / .env.local / ~/.claude.json)')
    return env


def supabase_headers(env):
    return [f'apikey: {env["SUPABASE_SERVICE_ROLE_KEY"]}',
            f'Authorization: Bearer {env["SUPABASE_SERVICE_ROLE_KEY"]}']


def resend_headers(env):
    return [f'Authorization: Bearer {env["RESEND_API_KEY"]}']


def fetch_signups(env):
    """Alle signups fra Supabase. Keyset-paginering (public_id > sidste) i
    stedet for offset, så rækker ikke kan forskubbe sig hvis nogen tilmelder
    sig midt i hentningen."""
    base = env['SUPABASE_URL'].rstrip('/')
    rows, last_id = [], None
    while True:
        flt = f'&public_id=gt.{last_id}' if last_id else ''
        url = (f'{base}/rest/v1/signup?select=public_id,email,first_name,unsub_token,'
               f'unsubscribed,created_at&order=public_id&limit=1000{flt}')
        data = curl(url, supabase_headers(env))
        if not isinstance(data, list):
            raise RuntimeError(f'Uventet Supabase-svar: {mask_pii(str(data))[:200]}')
        rows += data
        if len(data) < 1000:
            return rows
        last_id = data[-1]['public_id']


def fetch_already_linked(env):
    """E-mails der allerede har fået en link-mail iflg. Resends send-log.
    Fejler HØJT i stedet for lydløst: manglende 'data', stallet cursor eller
    en log der ikke når tilbage til 8. juni er en fejl, ikke en tom liste."""
    got, after, pages, oldest = set(), None, 0, '9999'
    while True:
        url = f'{RESEND_API}/emails?limit={RESEND_PAGE_SIZE}' + (f'&after={after}' if after else '')
        data = curl(url, resend_headers(env))
        if 'data' not in data or not isinstance(data['data'], list):
            raise RuntimeError(f'Resend-svar uden data-felt: {mask_pii(str(data))[:200]}')
        batch = data['data']
        for em in batch:
            created = (em.get('created_at') or '')[:10]
            if created:
                oldest = min(oldest, created)
            if norm_subject(em.get('subject')) in LINK_SUBJECTS:
                to = em.get('to') or []
                if isinstance(to, str):
                    to = [to]
                for rcpt in to:
                    addr = parseaddr(rcpt)[1] or rcpt
                    got.add(addr.strip().lower())
        pages += 1
        if data.get('has_more') is False or len(batch) < RESEND_PAGE_SIZE:
            break
        new_after = batch[-1].get('id')
        if not new_after or new_after == after or not CURSOR_RE.match(new_after):
            raise RuntimeError(f'Resend-paginering stallede på side {pages} — afbryder '
                               f'i stedet for at fortsætte med ufuldstændig dublet-liste.')
        after = new_after
        time.sleep(SLEEP)
    print(f'  Resend-log: {pages} sider læst (ældste {oldest}), '
          f'{len(got)} har allerede fået link-mail')
    if oldest > WELCOME_LIVE_DATE:
        print(f'  ⚠️  ADVARSEL: loggen når kun tilbage til {oldest}, men velkomstmails '
              f'er sendt siden {WELCOME_LIVE_DATE} — dublet-listen kan være ufuldstændig!')
    return got


def local_sent():
    """E-mails fra tidligere kørsler. 'attempting' uden efterfølgende 'sent'
    behandles KONSERVATIVT som sendt (Idempotency-Key gør gen-send harmløs,
    men vi vil hellere mangle én mail end dublere én)."""
    sent, attempting = set(), set()
    if os.path.exists(SENT_LOG):
        for line in open(SENT_LOG):
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            em = (rec.get('email') or '').lower()
            if rec.get('status') == 'sent':
                sent.add(em)
            elif rec.get('status') == 'attempting':
                attempting.add(em)
    unresolved = attempting - sent
    if unresolved:
        print(f'  ⚠️  {len(unresolved)} adresser stod som "attempting" uden "sent" — '
              f'behandles som sendt. Verificér evt. i Resend-loggen.')
    return sent | attempting


def build_targets(signups, linked, now_utc):
    """Ren filterfunktion (testes af --selftest). Returnerer (targets, stats)."""
    cutoff = (now_utc - timedelta(hours=FRESH_GRACE_H)).isoformat()
    stats = {'afmeldt_eller_ukendt': 0, 'ugyldig_email': 0, 'mangler_unsub_token': 0,
             'ugyldigt_id_eller_token': 0, 'for_ny': 0, 'har_link': 0, 'dublet': 0}
    targets, seen = [], set()
    for s in signups:
        email = (s.get('email') or '').strip().lower()
        if s.get('unsubscribed') is not False:
            stats['afmeldt_eller_ukendt'] += 1   # None = ukendt → vi sender IKKE
            continue
        if not email or '@' not in email:
            stats['ugyldig_email'] += 1
            continue
        if not s.get('unsub_token'):
            stats['mangler_unsub_token'] += 1    # uden afmeld-link sender vi ikke (lovkrav)
            continue
        if not (UUID_RE.match(s.get('public_id') or '') and UUID_RE.match(s['unsub_token'])):
            stats['ugyldigt_id_eller_token'] += 1
            continue
        if (s.get('created_at') or '') > cutoff:
            stats['for_ny'] += 1                 # sitet sender selv velkomst-med-link
            continue
        if email in linked:
            stats['har_link'] += 1
            continue
        if email in seen:
            stats['dublet'] += 1
            continue
        seen.add(email)
        targets.append({'public_id': s['public_id'], 'email': email,
                        'first_name': s.get('first_name'), 'unsub_token': s['unsub_token']})
    return targets, stats


def email_payload(t):
    first = (t.get('first_name') or '').strip() or 'du'
    invite = f'{SITE_URL}/?ref={t["public_id"]}'
    unsub = f'{SITE_URL}/api/unsubscribe?token={t["unsub_token"]}'
    return {
        'from': FROM_EMAIL,
        'to': [t['email']],
        'headers': {  # RFC 8058 one-click unsubscribe, som i lib/send-email.ts
            'List-Unsubscribe': f'<{unsub}>',
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
        'template': {
            'id': TEMPLATE_ALIAS,
            'variables': {
                'first_name': first,
                'invite_url': invite,
                'invite_url_encoded': quote(invite, safe=''),
                'unsubscribe_url': unsub,
            },
        },
    }


def batch_idem_key(chunk):
    """Deterministisk pr. modtagersæt: en retry af samme batch får samme nøgle,
    så Resend deduplikerer selv hvis vores første kald nåede frem."""
    digest = hashlib.sha256(','.join(sorted(t['email'] for t in chunk)).encode()).hexdigest()
    return f'referral-launch-{digest[:40]}'


def _open_state(path, mode):
    os.makedirs(STATE_DIR, mode=0o700, exist_ok=True)
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | (os.O_APPEND if 'a' in mode else os.O_TRUNC), 0o600)
    return os.fdopen(fd, mode)


def log_results(targets, ids, status, error=''):
    with _open_state(SENT_LOG, 'a') as f:
        if ids is None:
            ids = [None] * len(targets)
        for t, rid in zip(targets, ids):
            f.write(json.dumps({'email': t['email'], 'id': rid, 'status': status,
                                'error': mask_pii(error),
                                'at': datetime.now(timezone.utc).isoformat()}) + '\n')


def send_batch(env, chunk):
    """Ét kald til /emails/batch med Idempotency-Key. Returnerer mail-id'er."""
    body = json.dumps([email_payload(t) for t in chunk], ensure_ascii=False)
    data = curl(f'{RESEND_API}/emails/batch', resend_headers(env), method='POST',
                body=body, idem_key=batch_idem_key(chunk))
    items = data.get('data')
    if not isinstance(items, list) or len(items) != len(chunk):
        raise RuntimeError(f'Uventet batch-svar: {mask_pii(str(data))[:300]}')
    return [it.get('id') for it in items]


def selftest():
    """Offline test af målgruppe-filteret og payload-bygningen."""
    now = datetime(2026, 6, 11, 12, 0, tzinfo=timezone.utc)
    uid = '11111111-2222-3333-4444-555555555555'
    tok = '99999999-8888-7777-6666-555555555555'
    old, fresh = '2026-06-01T00:00:00+00:00', '2026-06-11T11:30:00+00:00'
    rows = [
        {'public_id': uid, 'email': 'ok@x.dk', 'first_name': ' Bo ', 'unsub_token': tok, 'unsubscribed': False, 'created_at': old},
        {'public_id': uid, 'email': 'afmeldt@x.dk', 'unsub_token': tok, 'unsubscribed': True, 'created_at': old},
        {'public_id': uid, 'email': 'ukendt@x.dk', 'unsub_token': tok, 'unsubscribed': None, 'created_at': old},
        {'public_id': uid, 'email': None, 'unsub_token': tok, 'unsubscribed': False, 'created_at': old},
        {'public_id': uid, 'email': 'utentoken@x.dk', 'unsub_token': None, 'unsubscribed': False, 'created_at': old},
        {'public_id': 'IKKE-ET-UUID', 'email': 'korrupt@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': old},
        {'public_id': uid, 'email': 'helt-ny@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': fresh},
        {'public_id': uid, 'email': 'HarLink@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': old},
        {'public_id': uid, 'email': 'OK@x.dk', 'first_name': '', 'unsub_token': tok, 'unsubscribed': False, 'created_at': old},
    ]
    targets, stats = build_targets(rows, {'harlink@x.dk'}, now)
    assert [t['email'] for t in targets] == ['ok@x.dk'], f'filter-fejl: {targets}'
    assert stats == {'afmeldt_eller_ukendt': 2, 'ugyldig_email': 1, 'mangler_unsub_token': 1,
                     'ugyldigt_id_eller_token': 1, 'for_ny': 1, 'har_link': 1, 'dublet': 1}, stats
    p = email_payload(targets[0])
    assert p['template']['variables']['first_name'] == 'Bo'
    assert p['template']['variables']['invite_url'] == f'{SITE_URL}/?ref={uid}'
    assert tok in p['headers']['List-Unsubscribe']
    assert email_payload({'public_id': uid, 'email': 'x@x.dk', 'first_name': '  ',
                          'unsub_token': tok})['template']['variables']['first_name'] == 'du'
    assert norm_subject('Du er på ventelisten 🎉️ ') in LINK_SUBJECTS
    k1, k2 = batch_idem_key(targets), batch_idem_key(list(reversed(targets)))
    assert k1 == k2 and k1.startswith('referral-launch-')
    try:
        _cfg_value('evil"\nurl = "https://evil.com')
        raise AssertionError('kontroltegn slap igennem _cfg_value')
    except ValueError:
        pass
    print('SELVTEST OK — filter, payload, idempotency-nøgle og curl-escaping opfører sig korrekt.')


def main():
    if '--selftest' in sys.argv:
        selftest()
        return
    if '--send' in sys.argv and '--test' in sys.argv:
        sys.exit('Vælg ÉN af --send og --test.')

    env = load_env()

    if '--test' in sys.argv:
        try:
            test_to = sys.argv[sys.argv.index('--test') + 1]
        except IndexError:
            sys.exit('Brug: --test nogen@mail.dk')
        t = {'public_id': '00000000-0000-4000-8000-000000000001', 'email': test_to,
             'first_name': 'Test', 'unsub_token': '00000000-0000-4000-8000-000000000002'}
        # Testen går gennem batch-API'et — præcis samme vej som den rigtige udsendelse.
        ids = send_batch(env, [t])
        print(f'Testmail sendt via batch-API til {test_to} (id {ids[0]}) — links er dummy.')
        return

    mode = 'send' if '--send' in sys.argv else 'dry'

    print('Henter ventelisten fra Supabase …')
    signups = fetch_signups(env)
    print(f'  {len(signups)} signups')
    print('Læser Resends send-log …')
    linked = fetch_already_linked(env)
    if mode == 'send' and len(linked) < SANITY_MIN_LINKED and '--force' not in sys.argv:
        sys.exit(f'STOP: kun {len(linked)} kendte link-modtagere fundet (forventet 200+). '
                 f'Dublet-værnet ser ufuldstændigt ud — tjek Resend-loggen. '
                 f'Kør med --force hvis det faktisk er korrekt.')
    linked |= local_sent()

    targets, stats = build_targets(signups, linked, datetime.now(timezone.utc))
    payloads = [email_payload(t) for t in targets]  # valider ALT før noget sendes

    with _open_state(TARGETS_FILE, 'w') as f:
        json.dump(targets, f, ensure_ascii=False, indent=1)

    skipped = ', '.join(f'{k}: {v}' for k, v in stats.items() if v)
    print(f'\nMÅLGRUPPE: {len(targets)} modtagere (frasorteret → {skipped or "ingen"})')
    print(f'Fuld liste: {TARGETS_FILE} (udenfor iCloud, 0600)')
    if payloads:
        sample = json.loads(json.dumps(payloads[0]))
        sample['to'] = ['***@***']
        print(f'Eksempel-payload (maskeret): {json.dumps(sample, ensure_ascii=False)[:400]}')

    if mode == 'dry':
        print('\nDRY-RUN — der blev IKKE sendt noget. Kør med --send for at sende.')
        return

    print(f'\nDu er ved at sende {len(targets)} e-mails fra {FROM_EMAIL}.')
    if input("Skriv SEND for at fortsætte: ").strip() != 'SEND':
        sys.exit('Afbrudt — intet sendt.')

    sent = failed = 0
    for i in range(0, len(targets), BATCH_SIZE):
        chunk = targets[i:i + BATCH_SIZE]
        log_results(chunk, None, 'attempting')
        try:
            ids = send_batch(env, chunk)
            log_results(chunk, ids, 'sent')
            sent += len(chunk)
        except ClientError as e:
            # Definitivt afslag (4xx) — prøv enkeltvis så én dårlig adresse
            # ikke vælter 100. Andre fejl (timeout m.m.) afbryder helt:
            # Idempotency-Key gør en gen-kørsel 100% sikker.
            print(f'  batch {i // BATCH_SIZE + 1} afvist ({e}); prøver enkeltvis …')
            consecutive = 0
            for t in chunk:
                try:
                    data = curl(f'{RESEND_API}/emails', resend_headers(env), method='POST',
                                body=json.dumps(email_payload(t), ensure_ascii=False),
                                idem_key=batch_idem_key([t]))
                    log_results([t], [data.get('id')], 'sent')
                    sent += 1
                    consecutive = 0
                except (ClientError, RuntimeError) as e2:
                    log_results([t], None, 'failed', str(e2))
                    failed += 1
                    consecutive += 1
                    if consecutive >= 5:
                        sys.exit(f'STOP: 5 enkelt-sends fejlede i træk ({e2}) — systematisk '
                                 f'fejl. Ret årsagen og kør igen (allerede sendte springes over).')
                time.sleep(SLEEP)
        except RuntimeError as e:
            sys.exit(f'STOP efter {sent} sendt: {e}\nKør scriptet igen når årsagen er fundet '
                     f'— Idempotency-Keys + loggen sikrer at ingen får dubletter.')
        print(f'  {min(i + BATCH_SIZE, len(targets))}/{len(targets)} behandlet '
              f'({sent} sendt, {failed} fejlet)')
        time.sleep(SLEEP)

    print(f'\nFÆRDIG: {sent} sendt, {failed} fejlet. Log: {SENT_LOG}')
    if failed:
        print('Fejlede adresser står i loggen med status=failed — kør igen for nyt forsøg.')


if __name__ == '__main__':
    main()
