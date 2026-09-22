import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const PASSWORD = "Norlys2026";
const COOKIE_NAME = "norlys_auth";

function loadDeck() {
  return fs.readFileSync(path.join(process.cwd(), "app/norlys/deck.html"), "utf-8");
}

function loginPage(error: boolean) {
  return `<!DOCTYPE html>
<html lang="da">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Norlys</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; background: #0b0b0c; color: #f5f5f5; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  form { background: #17171a; padding: 2.5rem; border-radius: 12px; width: 320px; }
  h1 { font-size: 1.1rem; margin: 0; }
  input { width: 100%; padding: 0.75rem; margin-top: 1rem; border-radius: 8px; border: 1px solid #333; background: #0b0b0c; color: #fff; box-sizing: border-box; }
  button { width: 100%; padding: 0.75rem; margin-top: 1rem; border-radius: 8px; border: none; background: #fff; color: #000; font-weight: 600; cursor: pointer; }
  p.error { color: #ff6b6b; margin: 0.5rem 0 0; font-size: 0.9rem; }
</style>
</head>
<body>
  <form method="POST" action="/norlys">
    <h1>Adgangskode påkrævet</h1>
    ${error ? '<p class="error">Forkert adgangskode.</p>' : ""}
    <input type="password" name="password" placeholder="Adgangskode" autofocus />
    <button type="submit">Åbn</button>
  </form>
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
