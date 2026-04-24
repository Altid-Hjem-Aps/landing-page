export function baseLayout(content: string, previewText: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${previewText}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #f5f4f0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; color: #1a1a1a; }
    a { color: #1a1a1a; }
  </style>
</head>
<body>
  <!-- preview text -->
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">${previewText}&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>

  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#f5f4f0;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;">

          <!-- logo -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <span style="font-size:20px;font-weight:700;letter-spacing:-0.5px;color:#1a1a1a;">Altid Hjem</span>
            </td>
          </tr>

          <!-- card -->
          <tr>
            <td style="background:#ffffff;border-radius:16px;padding:40px 40px 32px;">
              ${content}
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="padding-top:24px;text-align:center;font-size:13px;color:#888;line-height:1.6;">
              Altid Hjem ApS · Danmark<br/>
              <a href="https://altidhjem.dk" style="color:#888;text-decoration:none;">altidhjem.dk</a>
              &nbsp;·&nbsp;
              <a href="https://altidhjem.dk/afmeld?email={{email}}" style="color:#888;text-decoration:none;">Afmeld</a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function button(text: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:#1a1a1a;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;padding:14px 28px;border-radius:100px;letter-spacing:-0.2px;">${text}</a>`
}

export function divider(): string {
  return `<div style="height:1px;background:#f0ede8;margin:28px 0;"></div>`
}
