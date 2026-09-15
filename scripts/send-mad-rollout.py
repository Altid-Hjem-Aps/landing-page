#!/usr/bin/env python3
"""Batch-rollout blast: send 'waitlist-batch-rollout-cvi' ("Vi åbner dørene for
flere i Altid Hjem") til ALLE aktive på ventelisten.

Til forskel fra send-referral-launch.py (som KUN ramte dem der aldrig havde fået
deres link), går denne udsendelse til hele den aktive venteliste:
Supabase `signup` hvor unsubscribed=false, med gyldig e-mail + unsub_token
(uden afmeld-link sender vi ikke — lovkrav) + gyldigt public_id/unsub_token,
og som ikke står på en lille denylist af test-/engangsdomæner. Desuden gates
udsendelsen på markedsførings-samtykke: KUN tilmeldinger med
marketing_consent_mad=true modtager mailen (NULL/false = intet samtykke → ikke
sendt), jf. samtykke-dokumentationen.

Dublet-værn: en modtager springes over hvis denne kampagnes EGET emne allerede
står på personen i Resends send-log (også planlagte mails tæller) eller i den
lokale log. Hver mail får en deterministisk Idempotency-Key, så gentagne
kørsler/netværksfejl aldrig kan dublere.

PLANLAGT UDSENDELSE (kl. 08:00): Resends batch-API understøtter IKKE scheduled_at,
så ved --at sendes hver mail via single-endpointet (POST /emails) med
scheduled_at. Resend holder dem server-side og afsender til tiden — Mac'en
behøver IKKE være tændt. Planlagte mails kan annulleres igen med --cancel.

Kørsel:
    python3 send-mad-rollout.py                         # dry-run: viser tal, sender INTET
    python3 send-mad-rollout.py --selftest              # offline logik-test
    python3 send-mad-rollout.py --test MAIL             # én testmail (straks, dummy-links)
    python3 send-mad-rollout.py --send                  # send STRAKS (kræver 'SEND')
    python3 send-mad-rollout.py --send --at 2026-06-30T06:00:00Z   # planlæg (kræver 'SEND')
    python3 send-mad-rollout.py --cancel                # annullér alle planlagte mails fra loggen

Trinvis udsendelse (split): --half first|second deler modtagerne i to stabile,
disjunkte halvdele (hash af e-mail). Kør én gang pr. halvdel med hvert sit --at:
    python3 send-mad-rollout.py --send --half first  --at 2026-06-30T06:30:00Z   # 08:30 CEST
    python3 send-mad-rollout.py --send --half second --at 2026-06-30T18:00:00Z   # 20:00 CEST
Dry-run (uden --send) viser halvdelens størrelse uden at sende.

NB: 08:00 dansk sommertid (CEST) = 06:00:00Z. Angiv --at som ISO 8601 i UTC (…Z).
Persondata (modtagerliste + send-log) skrives til STATE_DIR i ~/Library — IKKE i
denne mappe, som ligger i iCloud Drive.
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
from datetime import datetime, timezone
from email.utils import parseaddr
from urllib.parse import quote

HERE = os.path.dirname(os.path.abspath(__file__))
STATE_DIR = os.path.expanduser('~/Library/Application Support/altid-dashboard')
TARGETS_FILE = os.path.join(STATE_DIR, 'mad-rollout-targets.json')
SENT_LOG = os.path.join(STATE_DIR, 'mad-rollout-sent-log.jsonl')

RESEND_API = 'https://api.resend.com'
RESEND_PAGE_SIZE = 100
SITE_URL = 'https://altidhjem.dk'
TEMPLATE_ALIAS = 'mad-batch-rollout'
CAMPAIGN_SUBJECT = 'Snart får du bedre råd til mad'
FROM_EMAIL = 'Altid Mad <hej@altidhjem.dk>'
BATCH_SIZE = 100
SLEEP = 0.7
UUID_RE = re.compile(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$')
CURSOR_RE = re.compile(r'^[A-Za-z0-9_-]{1,64}$')
EMAIL_MASK = re.compile(r'[A-Za-z0-9._%+\'-]+@[A-Za-z0-9.-]+')
ISO_UTC_RE = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$')

# Test-/engangsdomæner set i kontaktlisten — disse skal aldrig modtage den rigtige blast.
DENYLIST_DOMAINS = {'jctoto.com', 'onldm.net', 'vtmpj.net', 'mailinator.com',
                    'example.com', 'example.dk', 'test.com'}


def norm_subject(s):
    """Robust emne-sammenligning: unicode-normaliseret, casefoldet, uden
    variation selectors."""
    s = unicodedata.normalize('NFKC', s or '').replace('️', '')
    return ' '.join(s.split()).casefold()


CAMPAIGN_SUBJECT_NORM = norm_subject(CAMPAIGN_SUBJECT)


def mask_pii(text):
    return EMAIL_MASK.sub('***@***', text or '')


class ClientError(RuntimeError):
    """Definitivt 4xx-afslag fra API'et — gentagelse hjælper ikke."""


def _cfg_value(v):
    if any(c in v for c in '\n\r\0'):
        raise ValueError('kontroltegn i curl-parameter')
    return v.replace('\\', '\\\\').replace('"', '\\"')


def curl(url, headers, method='GET', body=None, retries=3, idem_key=None):
    """curl med headers via en 0600-config-fil så nøgler aldrig står i `ps`."""
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
    """Hemmeligheder fra ./.env (team) ellers landing-repoets .env.local."""
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
    """Alle signups fra Supabase via keyset-paginering (public_id > sidste)."""
    base = env['SUPABASE_URL'].rstrip('/')
    rows, last_id = [], None
    while True:
        flt = f'&public_id=gt.{last_id}' if last_id else ''
        url = (f'{base}/rest/v1/signup?select=public_id,email,first_name,unsub_token,'
               f'unsubscribed,created_at,marketing_consent_mad&order=public_id&limit=1000{flt}')
        data = curl(url, supabase_headers(env))
        if not isinstance(data, list):
            # A missing marketing_consent_mad column means the consent migration
            # has not run yet. Fail LOUD with a clear hint rather than a cryptic
            # dump — we must never fall back to sending without the consent gate.
            if 'marketing_consent_mad' in str(data):
                raise RuntimeError(
                    'Kolonnen marketing_consent_mad findes ikke i Supabase endnu. '
                    'Kør consent-migrationen (mad-site: supabase/migrations/'
                    '20260713_consent_columns.sql) i Supabase SQL Editor FØR du '
                    'sender — udsendelsen gates på samtykket.')
            raise RuntimeError(f'Uventet Supabase-svar: {mask_pii(str(data))[:200]}')
        rows += data
        if len(data) < 1000:
            return rows
        last_id = data[-1]['public_id']


def fetch_campaign_recipients(env):
    """E-mails der ALLEREDE har fået (eller har planlagt) netop denne kampagne
    iflg. Resends send-log — så re-kørsler aldrig dublerer. Fejler HØJT ved
    stallet paginering frem for lydløst at returnere en ufuldstændig liste."""
    got, after, pages = set(), None, 0
    while True:
        url = f'{RESEND_API}/emails?limit={RESEND_PAGE_SIZE}' + (f'&after={after}' if after else '')
        data = curl(url, resend_headers(env))
        if 'data' not in data or not isinstance(data['data'], list):
            raise RuntimeError(f'Resend-svar uden data-felt: {mask_pii(str(data))[:200]}')
        batch = data['data']
        for em in batch:
            if norm_subject(em.get('subject')) == CAMPAIGN_SUBJECT_NORM:
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
    print(f'  Resend-log: {pages} sider læst, {len(got)} har allerede fået/planlagt denne kampagne')
    return got


def local_sent():
    """E-mails fra tidligere kørsler. 'attempting' uden 'sent'/'scheduled'
    behandles KONSERVATIVT som sendt (Idempotency-Key gør gen-send harmløs)."""
    done, attempting = set(), set()
    if os.path.exists(SENT_LOG):
        for line in open(SENT_LOG):
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            em = (rec.get('email') or '').lower()
            if rec.get('status') in ('sent', 'scheduled'):
                done.add(em)
            elif rec.get('status') == 'attempting':
                attempting.add(em)
    unresolved = attempting - done
    if unresolved:
        print(f'  ⚠️  {len(unresolved)} adresser stod som "attempting" uden resultat — '
              f'behandles som sendt. Verificér evt. i Resend-loggen.')
    return done | attempting


def build_targets(signups, already, now_utc):
    """Ren filterfunktion (testes af --selftest). Returnerer (targets, stats)."""
    stats = {'afmeldt_eller_ukendt': 0, 'ugyldig_email': 0, 'mangler_unsub_token': 0,
             'ugyldigt_id_eller_token': 0, 'denylist_domæne': 0, 'allerede_sendt': 0,
             'dublet': 0, 'mangler_samtykke': 0}
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
            stats['mangler_unsub_token'] += 1
            continue
        if not (UUID_RE.match(s.get('public_id') or '') and UUID_RE.match(s['unsub_token'])):
            stats['ugyldigt_id_eller_token'] += 1
            continue
        if email.rsplit('@', 1)[-1] in DENYLIST_DOMAINS:
            stats['denylist_domæne'] += 1
            continue
        if email in already:
            stats['allerede_sendt'] += 1
            continue
        if email in seen:
            stats['dublet'] += 1
            continue
        # Markedsførings-samtykke er den sidste port: send KUN til dem der aktivt
        # har sagt ja til Altid Mad-markedsføring. NULL (historiske tilmeldinger
        # fra før samtykke-feltet fandtes) tæller som IKKE-samtykke → sendes ikke.
        if s.get('marketing_consent_mad') is not True:
            stats['mangler_samtykke'] += 1
            continue
        seen.add(email)
        targets.append({'public_id': s['public_id'], 'email': email,
                        'first_name': s.get('first_name'), 'unsub_token': s['unsub_token']})
    return targets, stats


def email_payload(t, scheduled_at=None):
    first = (t.get('first_name') or '').strip() or 'du'
    invite = f'{SITE_URL}/?ref={t["public_id"]}'
    invite_page = f'{SITE_URL}/inviter?ref={t["public_id"]}'
    unsub = f'{SITE_URL}/api/unsubscribe?token={t["unsub_token"]}'
    payload = {
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
                'invite_page_url': invite_page,
                'unsubscribe_url': unsub,
            },
        },
    }
    if scheduled_at:
        payload['scheduled_at'] = scheduled_at
    return payload


def one_idem_key(t):
    digest = hashlib.sha256(t['email'].encode()).hexdigest()
    return f'mad-rollout-{digest[:40]}'


def batch_idem_key(chunk):
    digest = hashlib.sha256(','.join(sorted(t['email'] for t in chunk)).encode()).hexdigest()
    return f'mad-rollout-{digest[:40]}'


def _open_state(path, mode):
    os.makedirs(STATE_DIR, mode=0o700, exist_ok=True)
    fd = os.open(path, os.O_WRONLY | os.O_CREAT | (os.O_APPEND if 'a' in mode else os.O_TRUNC), 0o600)
    return os.fdopen(fd, mode)


def log_results(targets, ids, status, error='', scheduled_at=None):
    with _open_state(SENT_LOG, 'a') as f:
        if ids is None:
            ids = [None] * len(targets)
        for t, rid in zip(targets, ids):
            f.write(json.dumps({'email': t['email'], 'id': rid, 'status': status,
                                'error': mask_pii(error), 'scheduled_at': scheduled_at,
                                'at': datetime.now(timezone.utc).isoformat()}) + '\n')


def send_one(env, t, scheduled_at=None, idem_key=None):
    """Ét kald til /emails (understøtter scheduled_at). Returnerer mail-id.
    idem_key kan overskrives (fx i --test, så gentagne testmails faktisk sendes
    i stedet for at blive dedupliceret af den deterministiske nøgle)."""
    data = curl(f'{RESEND_API}/emails', resend_headers(env), method='POST',
                body=json.dumps(email_payload(t, scheduled_at), ensure_ascii=False),
                idem_key=idem_key or one_idem_key(t))
    return data.get('id')


def send_batch(env, chunk):
    """Ét kald til /emails/batch (KUN straks — batch understøtter ikke scheduled_at)."""
    body = json.dumps([email_payload(t) for t in chunk], ensure_ascii=False)
    data = curl(f'{RESEND_API}/emails/batch', resend_headers(env), method='POST',
                body=body, idem_key=batch_idem_key(chunk))
    items = data.get('data')
    if not isinstance(items, list) or len(items) != len(chunk):
        raise RuntimeError(f'Uventet batch-svar: {mask_pii(str(data))[:300]}')
    return [it.get('id') for it in items]


def run_scheduled(env, targets, scheduled_at):
    """Single-send pr. modtager med scheduled_at. Resend afsender server-side."""
    sent = failed = consecutive = 0
    for i, t in enumerate(targets, 1):
        log_results([t], None, 'attempting', scheduled_at=scheduled_at)
        try:
            rid = send_one(env, t, scheduled_at)
            log_results([t], [rid], 'scheduled', scheduled_at=scheduled_at)
            sent += 1
            consecutive = 0
        except (ClientError, RuntimeError) as e:
            log_results([t], None, 'failed', str(e))
            failed += 1
            consecutive += 1
            if consecutive >= 5:
                sys.exit(f'STOP: 5 sends fejlede i træk ({e}) — systematisk fejl. Ret '
                         f'årsagen og kør igen (allerede planlagte springes over).')
        if i % 50 == 0 or i == len(targets):
            print(f'  {i}/{len(targets)} behandlet ({sent} planlagt, {failed} fejlet)')
        time.sleep(SLEEP)
    return sent, failed


def run_immediate(env, targets):
    """Batch-send straks (100 pr. kald)."""
    sent = failed = 0
    for i in range(0, len(targets), BATCH_SIZE):
        chunk = targets[i:i + BATCH_SIZE]
        log_results(chunk, None, 'attempting')
        try:
            ids = send_batch(env, chunk)
            log_results(chunk, ids, 'sent')
            sent += len(chunk)
        except ClientError as e:
            print(f'  batch {i // BATCH_SIZE + 1} afvist ({e}); prøver enkeltvis …')
            consecutive = 0
            for t in chunk:
                try:
                    rid = send_one(env, t)
                    log_results([t], [rid], 'sent')
                    sent += 1
                    consecutive = 0
                except (ClientError, RuntimeError) as e2:
                    log_results([t], None, 'failed', str(e2))
                    failed += 1
                    consecutive += 1
                    if consecutive >= 5:
                        sys.exit(f'STOP: 5 enkelt-sends fejlede i træk ({e2}) — systematisk fejl.')
                time.sleep(SLEEP)
        except RuntimeError as e:
            sys.exit(f'STOP efter {sent} sendt: {e}\nKør igen når årsagen er fundet — '
                     f'Idempotency-Keys + loggen sikrer ingen dubletter.')
        print(f'  {min(i + BATCH_SIZE, len(targets))}/{len(targets)} behandlet '
              f'({sent} sendt, {failed} fejlet)')
        time.sleep(SLEEP)
    return sent, failed


def cancel_scheduled(env):
    """Annullér alle planlagte mails (status=scheduled med id) fra loggen."""
    ids = {}
    if os.path.exists(SENT_LOG):
        for line in open(SENT_LOG):
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            if rec.get('status') == 'scheduled' and rec.get('id'):
                ids[rec['id']] = rec.get('email')
    if not ids:
        print('Ingen planlagte mails i loggen at annullere.')
        return
    print(f'Annullerer {len(ids)} planlagte mails …')
    ok = fail = 0
    for rid in ids:
        try:
            curl(f'{RESEND_API}/emails/{rid}/cancel', resend_headers(env), method='POST')
            with _open_state(SENT_LOG, 'a') as f:
                f.write(json.dumps({'email': ids[rid], 'id': rid, 'status': 'cancelled',
                                    'at': datetime.now(timezone.utc).isoformat()}) + '\n')
            ok += 1
        except (ClientError, RuntimeError) as e:
            print(f'  kunne ikke annullere {rid}: {e}')
            fail += 1
        time.sleep(SLEEP)
    print(f'FÆRDIG: {ok} annulleret, {fail} fejlet.')


def selftest():
    now = datetime(2026, 6, 29, 12, 0, tzinfo=timezone.utc)
    uid = '11111111-2222-3333-4444-555555555555'
    tok = '99999999-8888-7777-6666-555555555555'
    rows = [
        {'public_id': uid, 'email': 'ok@x.dk', 'first_name': ' Bo ', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01', 'marketing_consent_mad': True},
        {'public_id': uid, 'email': 'utensamtykke@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01', 'marketing_consent_mad': None},
        {'public_id': uid, 'email': 'afmeldt@x.dk', 'unsub_token': tok, 'unsubscribed': True, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': 'ukendt@x.dk', 'unsub_token': tok, 'unsubscribed': None, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': None, 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': 'utentoken@x.dk', 'unsub_token': None, 'unsubscribed': False, 'created_at': '2026-06-01'},
        {'public_id': 'IKKE-ET-UUID', 'email': 'korrupt@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': 'spam@jctoto.com', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': 'HarFaaet@x.dk', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01'},
        {'public_id': uid, 'email': 'OK@x.dk', 'first_name': '', 'unsub_token': tok, 'unsubscribed': False, 'created_at': '2026-06-01'},
    ]
    targets, stats = build_targets(rows, {'harfaaet@x.dk'}, now)
    assert [t['email'] for t in targets] == ['ok@x.dk'], f'filter-fejl: {targets}'
    assert stats == {'afmeldt_eller_ukendt': 2, 'ugyldig_email': 1, 'mangler_unsub_token': 1,
                     'ugyldigt_id_eller_token': 1, 'denylist_domæne': 1, 'allerede_sendt': 1,
                     'dublet': 1, 'mangler_samtykke': 1}, stats
    p = email_payload(targets[0])
    v = p['template']['variables']
    assert v['first_name'] == 'Bo'
    assert v['invite_url'] == f'{SITE_URL}/?ref={uid}'
    assert v['invite_page_url'] == f'{SITE_URL}/inviter?ref={uid}'
    assert v['unsubscribe_url'].endswith(tok)
    assert 'scheduled_at' not in p
    assert email_payload(targets[0], '2026-06-30T06:00:00Z')['scheduled_at'] == '2026-06-30T06:00:00Z'
    assert tok in p['headers']['List-Unsubscribe']
    assert email_payload({'public_id': uid, 'email': 'x@x.dk', 'first_name': '  ',
                          'unsub_token': tok})['template']['variables']['first_name'] == 'du'
    assert norm_subject('Snart får du bedre råd til mad ') == CAMPAIGN_SUBJECT_NORM
    assert one_idem_key({'email': 'a@x.dk'}) == one_idem_key({'email': 'a@x.dk'})
    assert _parse_iso_utc('2026-06-30T06:00:00Z') == datetime(2026, 6, 30, 6, 0, tzinfo=timezone.utc)
    assert _parse_iso_utc('2026-06-30T06:00:00.500Z') == datetime(2026, 6, 30, 6, 0, 0, 500000, tzinfo=timezone.utc)
    half_rows = [{'public_id': uid, 'email': f'user{i}@x.dk', 'unsub_token': tok,
                  'unsubscribed': False, 'created_at': '2026-06-01',
                  'marketing_consent_mad': True} for i in range(9)]
    elig, _ = build_targets(half_rows, set(), now)
    assert len(elig) == 9
    first_h, second_h = select_half(elig, 'first'), select_half(elig, 'second')
    assert len(first_h) == 5 and len(second_h) == 4          # ulige → 'first' får den ekstra
    ea, eb = {t['email'] for t in first_h}, {t['email'] for t in second_h}
    assert ea.isdisjoint(eb), 'halvdele overlapper'
    assert ea | eb == {t['email'] for t in elig}, 'halvdele dækker ikke alle'
    assert select_half(elig, 'first') == first_h, 'opdeling er ikke stabil mellem kørsler'
    try:
        _cfg_value('evil"\nurl = "https://evil.com')
        raise AssertionError('kontroltegn slap igennem _cfg_value')
    except ValueError:
        pass
    print('SELVTEST OK — filter, payload, scheduling, idempotency-nøgle og curl-escaping er korrekte.')


def _parse_iso_utc(val):
    """Parse en ISO 8601 UTC-streng (…Z, evt. med brøk-sekunder) til aware datetime.
    Forudsætter at ISO_UTC_RE allerede har valideret formatet."""
    core = val[:-1]  # fjern det afsluttende 'Z'
    fmt = '%Y-%m-%dT%H:%M:%S.%f' if '.' in core else '%Y-%m-%dT%H:%M:%S'
    return datetime.strptime(core, fmt).replace(tzinfo=timezone.utc)


def parse_at():
    if '--at' not in sys.argv:
        return None
    try:
        val = sys.argv[sys.argv.index('--at') + 1]
    except IndexError:
        sys.exit('Brug: --at 2026-06-30T06:00:00Z  (ISO 8601 i UTC; 08:00 CEST = 06:00:00Z)')
    if not ISO_UTC_RE.match(val):
        sys.exit(f'Ugyldig --at "{val}". Forventer ISO 8601 UTC, fx 2026-06-30T06:00:00Z.')
    if _parse_iso_utc(val) <= datetime.now(timezone.utc):
        sys.exit(f'--at {val} ligger i fortiden. Vælg et fremtidigt tidspunkt.')
    return val


def parse_half():
    if '--half' not in sys.argv:
        return None
    try:
        which = sys.argv[sys.argv.index('--half') + 1]
    except IndexError:
        sys.exit('Brug: --half first|second')
    if which not in ('first', 'second'):
        sys.exit(f'Ugyldig --half "{which}". Vælg "first" eller "second".')
    return which


def select_half(eligible, which):
    """Stabil, deterministisk 50/50-opdeling efter e-mail-hash. Uafhængig af
    dublet-værnet, så de to halvdele ALTID er disjunkte og dækker alle — også
    når 'first' og 'second' køres i hver sin kommando (evt. på hver sin maskine).
    Ulige antal: 'first' får den ekstra. Hash-baseret = tilfældig fordeling, så
    et åbnings-rate-split på sendetidspunkt ikke skævvrides af tilmeldingstidspunkt."""
    ranked = sorted(eligible, key=lambda t: hashlib.sha256(t['email'].encode()).hexdigest())
    mid = (len(ranked) + 1) // 2
    return ranked[:mid] if which == 'first' else ranked[mid:]


def main():
    if '--selftest' in sys.argv:
        selftest()
        return
    if '--send' in sys.argv and '--test' in sys.argv:
        sys.exit('Vælg ÉN af --send og --test.')

    env = load_env()

    if '--cancel' in sys.argv:
        cancel_scheduled(env)
        return

    if '--test' in sys.argv:
        try:
            test_to = sys.argv[sys.argv.index('--test') + 1]
        except IndexError:
            sys.exit('Brug: --test nogen@mail.dk')
        t = {'public_id': '00000000-0000-4000-8000-000000000001', 'email': test_to,
             'first_name': 'Test', 'unsub_token': '00000000-0000-4000-8000-000000000002'}
        rid = send_one(env, t, idem_key=f'mad-rollout-test-{int(time.time())}')
        print(f'Testmail sendt til {test_to} (id {rid}) — links er dummy.')
        return

    scheduled_at = parse_at()
    which = parse_half()
    mode = 'send' if '--send' in sys.argv else 'dry'

    print('Henter ventelisten fra Supabase …')
    signups = fetch_signups(env)
    print(f'  {len(signups)} signups')
    print('Læser Resends send-log (dublet-værn på kampagne-emnet) …')
    already = fetch_campaign_recipients(env)
    already |= local_sent()

    # Opdel FØR dublet-værnet, så halvdelene er stabile og disjunkte; fjern
    # derefter dem der allerede har fået/planlagt kampagnen.
    eligible, stats = build_targets(signups, set(), datetime.now(timezone.utc))
    bucket = select_half(eligible, which) if which else eligible
    targets = [t for t in bucket if t['email'] not in already]
    already_removed = len(bucket) - len(targets)
    payloads = [email_payload(t, scheduled_at) for t in targets]  # valider ALT før noget sendes

    with _open_state(TARGETS_FILE, 'w') as f:
        json.dump(targets, f, ensure_ascii=False, indent=1)

    skipped = ', '.join(f'{k}: {v}' for k, v in stats.items() if v and k != 'allerede_sendt')
    half_label = (f'HALVDEL "{which}": {len(bucket)} af {len(eligible)} berettigede'
                  if which else f'ALLE berettigede: {len(eligible)}')
    print(f'\n{half_label}')
    print(f'MÅLGRUPPE: {len(targets)} modtagere '
          f'(frasorteret før opdeling → {skipped or "ingen"}; allerede sendt/planlagt → {already_removed})')
    print(f'Skabelon: {TEMPLATE_ALIAS} · emne: "{CAMPAIGN_SUBJECT}"')
    print(f'Levering: {"PLANLAGT " + scheduled_at + " (single-send)" if scheduled_at else "STRAKS (batch)"}')
    print(f'Fuld liste: {TARGETS_FILE} (udenfor iCloud, 0600)')
    if payloads:
        sample = json.loads(json.dumps(payloads[0]))
        sample['to'] = ['***@***']
        print(f'Eksempel-payload (maskeret): {json.dumps(sample, ensure_ascii=False)[:500]}')

    if mode == 'dry':
        print('\nDRY-RUN — der blev IKKE sendt noget. Tilføj --send for at sende.')
        return

    if not targets:
        sys.exit('Ingen modtagere tilbage — intet at sende.')

    when = f'planlagt til {scheduled_at}' if scheduled_at else 'STRAKS'
    print(f'\nDu er ved at sende {len(targets)} e-mails fra {FROM_EMAIL} ({when}).')
    if input("Skriv SEND for at fortsætte: ").strip() != 'SEND':
        sys.exit('Afbrudt — intet sendt.')

    if scheduled_at:
        sent, failed = run_scheduled(env, targets, scheduled_at)
        verb = 'planlagt'
    else:
        sent, failed = run_immediate(env, targets)
        verb = 'sendt'
    print(f'\nFÆRDIG: {sent} {verb}, {failed} fejlet. Log: {SENT_LOG}')
    if scheduled_at:
        print(f'Mails afsendes {scheduled_at}. Annullér med: python3 {os.path.basename(__file__)} --cancel')
    if failed:
        print('Fejlede adresser står i loggen med status=failed — kør igen for nyt forsøg.')


if __name__ == '__main__':
    main()
