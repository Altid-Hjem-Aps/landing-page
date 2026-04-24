import { baseLayout, button, divider } from './base'

interface Props {
  name: string
  email: string
}

export function waitlistConfirmation({ name, email }: Props) {
  const firstName = name.split(' ')[0]

  const content = `
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;color:#1a1a1a;margin-bottom:16px;">
      Du er på ventelisten 🎉
    </h1>

    <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px;">
      Hej ${firstName},<br/><br/>
      Tak fordi du meldte dig til. Du er nu skrevet op til Altid Hjem — én app til alle dine faste udgifter i hjemmet.
    </p>

    ${divider()}

    <p style="font-size:14px;color:#888;line-height:1.6;margin-bottom:24px;">
      <strong style="color:#1a1a1a;">Hvad sker der nu?</strong><br/>
      Vi er snart klar til at åbne dørene. Du hører fra os, så snart du kan komme i gang — vi kontakter de første ventelistemedlemmer direkte.
    </p>

    <div style="text-align:center;margin-bottom:8px;">
      ${button('Se hvad Altid Hjem er', 'https://altidhjem.dk')}
    </div>
  `

  return {
    subject: 'Du er på ventelisten til Altid Hjem',
    html: baseLayout(content, `Tak ${firstName} — du er på ventelisten til Altid Hjem`).replace(/\{\{email\}\}/g, encodeURIComponent(email)),
  }
}
