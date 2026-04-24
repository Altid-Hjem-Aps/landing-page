import { baseLayout, button, divider } from './base'

interface Props {
  name: string
  email: string
}

export function waitlistFollowup2({ name, email }: Props) {
  const firstName = name.split(' ')[0]

  const content = `
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;color:#1a1a1a;margin-bottom:16px;">
      Vi åbner snart — du er blandt de første
    </h1>

    <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px;">
      Hej ${firstName},<br/><br/>
      Vi er tæt på. Altid Hjem er ved at åbne for de første brugere, og du er på listen.
    </p>

    <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px;">
      Kender du nogen, der også burde være med? Send dem linket — jo flere vi er fra starten, jo hurtigere kan vi forhandle bedre priser til alle.
    </p>

    ${divider()}

    <div style="background:#f5f4f0;border-radius:12px;padding:20px 24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:13px;color:#888;margin-bottom:8px;">Del din ventelistelink</p>
      <p style="font-size:15px;font-weight:600;color:#1a1a1a;word-break:break-all;">altidhjem.dk</p>
    </div>

    <div style="text-align:center;margin-bottom:8px;">
      ${button('Del Altid Hjem', 'https://altidhjem.dk')}
    </div>
  `

  return {
    subject: 'Vi åbner snart — kender du nogen der burde med?',
    html: baseLayout(content, 'Du er blandt de første til at prøve Altid Hjem').replace(/\{\{email\}\}/g, encodeURIComponent(email)),
  }
}
