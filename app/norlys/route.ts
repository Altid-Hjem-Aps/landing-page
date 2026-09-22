import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const PASSWORD = "Norlys2026";
const COOKIE_NAME = "norlys_auth";

function loadDeck() {
  return fs.readFileSync(path.join(process.cwd(), "app/norlys/deck.html"), "utf-8");
}

const ALTID_LOGO = `<svg viewBox="0 0 944.2 500.74" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fdfaf4" d="M186.61,311.72v-25.28h-.84c-10.11,20.64-37.91,33.28-68.66,33.28C48.02,319.73,0,265.38,0,194.61s50.13-124.69,117.11-124.69c28.64,0,55.18,11.37,68.66,32.86h.84v-24.85h69.93v233.79h-69.93ZM186.61,194.61c0-32.86-26.54-59.39-59.4-59.39s-57.29,26.54-57.29,60.24,25.7,58.98,58.13,58.98,58.55-26.12,58.55-59.82Z"/><path fill="#fdfaf4" d="M309.6,311.72V0h69.93v311.72h-69.93Z"/><path fill="#fdfaf4" d="M443.98,311.72v-180.71h-34.54v-53.08h34.54V0h69.93v77.93h33.7v53.08h-33.7v180.71h-69.93Z"/><path fill="#fdfaf4" d="M577.93,53.08V0h69.93v53.08h-69.93ZM577.93,311.72V77.93h69.93v233.79h-69.93Z"/><path fill="#fdfaf4" d="M875.33,311.72v-25.28h-.84c-13.06,21.48-36.65,32.86-69.93,32.86-70.77,0-117.11-54.34-117.11-125.11s47.6-124.27,115.84-124.27c26.96,0,48.86,8,68.66,27.8V0h69.93v311.72h-66.56ZM875.75,193.77c0-32.44-24.85-58.55-59.4-58.55s-58.98,24.43-58.98,58.55,24.85,60.24,58.55,60.24,59.82-25.7,59.82-60.24Z"/><path fill="#fdfaf4" d="M628.59,465.71v-48.37c0-19.12-7.39-27.8-22.18-27.8s-23.46,10.61-23.46,27.96v48.21h-16.71v-118.92h16.71v39.37h.32c5.3-7.88,13.82-11.89,24.91-11.89,21.21,0,37.12,13.5,37.12,37.93v53.51h-16.71Z"/><path fill="#fdfaf4" d="M657.35,483.23c6.59-.64,11.09-2.57,11.09-16.23v-90.31h16.71v94.81c0,19.29-16.87,29.25-27.8,29.25v-17.51ZM668.44,366.4v-19.6h16.71v19.6h-16.71Z"/><path fill="#fdfaf4" d="M718.58,428.43c3.86,14.79,15.59,24.27,29.25,24.27,10.44,0,20.25-5.46,25.39-14.94h16.71c-6.91,18.32-23.62,30.21-42.75,30.21-25.07,0-45.32-22.18-45.32-45.96,0-28.12,21.21-47.73,44.84-47.73,26.19,0,46.12,20.25,46.12,45.8,0,2.73,0,5.3-.48,8.36h-73.76ZM776.11,415.57c-1.28-15.11-14.62-26.03-28.93-26.03s-27.32,10.77-28.6,26.03h57.53Z"/><path fill="#fdfaf4" d="M927.48,465.71v-49.82c0-16.88-7.07-26.36-21.05-26.36-14.78,0-21.21,8.2-21.21,26.03v50.14h-16.71v-51.74c0-17.52-8.2-24.43-20.25-24.43-14.78,0-22.02,8.68-22.02,26.19v49.98h-16.71v-89.03h15.43v9.64h.32c7.23-8.52,13.98-12.05,25.55-12.05s23.14,5.63,27.64,14.94c6.43-10.12,15.27-14.94,29.41-14.94,23.14,0,36.32,14.46,36.32,37.44v53.99h-16.71Z"/></svg>`;

function loginPage(error: boolean) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Norlys × Altid Hjem</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  :root { --forest-dark: #0d2818; --forest: #163223; --forest-mid: #1f5a33; --cream: #fdfaf4; }
  * { box-sizing: border-box; }
  body {
    font-family: 'Onest', system-ui, sans-serif;
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
  .logo { width: 168px; margin-bottom: 28px; }
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
    ${ALTID_LOGO}
    <span class="pill">Norlys × Altid Hjem</span>
    <h1>Indtast adgangskoden for at se oplægget</h1>
    <form method="POST" action="/norlys">
      ${error ? '<p class="error">Forkert adgangskode, prøv igen.</p>' : ""}
      <input type="password" name="password" placeholder="Adgangskode" autofocus />
      <button type="submit">Åbn oplæg</button>
    </form>
  </main>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const authed = request.cookies.get(COOKIE_NAME)?.value === "granted";

  if (authed) {
    return new NextResponse(loadDeck(), {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  return new NextResponse(loginPage(false), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const password = formData.get("password");

  if (password === PASSWORD) {
    const response = NextResponse.redirect(new URL("/norlys", request.url), 303);
    response.cookies.set(COOKIE_NAME, "granted", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/norlys",
    });
    return response;
  }

  return new NextResponse(loginPage(true), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
