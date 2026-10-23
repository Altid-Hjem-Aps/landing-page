import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import fs from "fs";
import path from "path";

// Same gate as /norlys. The deck lives next to this file, outside public/, so
// it is only reachable through this handler.
export const runtime = "nodejs";

const PASSWORD = "tryg2026";
const COOKIE_NAME = "tryg_demo_auth";
// Not a static "granted": a cookie typed by hand must not open the deck.
const COOKIE_VALUE = createHash("sha256").update(`tryg-demo:${PASSWORD}`).digest("hex");

const HTML_HEADERS = {
  "content-type": "text/html; charset=utf-8",
  "cache-control": "private, no-store",
  "x-robots-tag": "noindex, nofollow",
};

function loadDeck() {
  return fs.readFileSync(path.join(process.cwd(), "app/tryg-demo/deck.html"), "utf-8");
}

function loginPage(error: boolean) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Tryg × Altid Hjem</title>
<style>
  :root { --forest-dark: #0d2818; --forest: #163223; --forest-mid: #1f5a33; --cream: #fdfaf4; }
  * { box-sizing: border-box; }
  body {
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    background: radial-gradient(120% 120% at 50% 0%, var(--forest-mid) 0%, var(--forest-dark) 60%);
    color: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    margin: 0;
    padding: 24px;
  }
  main { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 360px; }
  .pill {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--forest); color: var(--cream);
    border-radius: 999px; padding: 8px 16px;
    font-size: 13px; font-weight: 600; letter-spacing: .01em;
    margin-bottom: 18px;
  }
  h1 { font-size: 20px; font-weight: 600; margin: 0 0 28px; text-align: center; color: var(--cream); }
  form { width: 100%; }
  input {
    width: 100%; padding: 14px 16px; font-size: 16px; font-family: inherit;
    border-radius: 12px; border: 1px solid rgba(253,250,244,.25);
    background: rgba(253,250,244,.08); color: var(--cream);
  }
  input::placeholder { color: rgba(253,250,244,.5); }
  input:focus { outline: none; border-color: var(--cream); }
  button {
    width: 100%; margin-top: 14px; padding: 14px 16px;
    border-radius: 999px; border: none;
    background: var(--cream); color: var(--forest-dark);
    font-family: inherit; font-size: 16px; font-weight: 600; cursor: pointer;
  }
  button:hover { background: #fff; }
  p.error {
    color: #ffbab8; background: rgba(198,0,15,.15);
    border-radius: 10px; padding: 10px 14px;
    margin: 0 0 14px; font-size: 14px; text-align: center;
  }
</style>
</head>
<body>
  <main>
    <span class="pill">Tryg × Altid Hjem</span>
    <h1>Indtast adgangskoden for at se demoen</h1>
    <form method="POST" action="/tryg-demo">
      ${error ? '<p class="error">Forkert adgangskode, prøv igen.</p>' : ""}
      <input type="password" name="password" placeholder="Adgangskode" autofocus />
      <button type="submit">Åbn demo</button>
    </form>
  </main>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  if (request.cookies.get(COOKIE_NAME)?.value === COOKIE_VALUE) {
    return new NextResponse(loadDeck(), { headers: HTML_HEADERS });
  }

  return new NextResponse(loginPage(false), { status: 401, headers: HTML_HEADERS });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password === PASSWORD) {
    const response = NextResponse.redirect(new URL("/tryg-demo", request.url), 303);
    response.cookies.set(COOKIE_NAME, COOKIE_VALUE, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/tryg-demo",
    });
    return response;
  }

  return new NextResponse(loginPage(true), { status: 401, headers: HTML_HEADERS });
}
