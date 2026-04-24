import { baseLayout, button, divider } from './base'

interface Props {
  name: string
  email: string
}

export function waitlistFollowup1({ name, email }: Props) {
  const firstName = name.split(' ')[0]

  const content = `
    <h1 style="font-size:26px;font-weight:700;letter-spacing:-0.5px;line-height:1.2;color:#1a1a1a;margin-bottom:16px;">
      Én app til hele husstanden
    </h1>

    <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px;">
      Hej ${firstName},<br/><br/>
      Vidste du, at en dansk gennemsnitsfamilie bruger over 40 timer om året på at håndtere strøm, forsikring, mobil og andre faste udgifter?
    </p>

    <p style="font-size:16px;color:#444;line-height:1.6;margin-bottom:24px;">
      Altid Hjem samler det hele ét sted — med klare priser og ingen overraskelser på fakturaen.
    </p>

    ${divider()}

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      ${feature('⚡', 'Strøm', 'Fra Altid Energi — Danmarks mest gennemsigtige elselskab.')}
      ${feature('📱', 'Mobil', 'Én simpel plan. Ingen binding.')}
      ${feature('🛡️', 'Forsikring', 'Fair dækning uden finprint.')}
      ${feature('🔌', 'EV-opladning', 'Hjemmeoplader og offentlig ladning samlet.')}
    </table>

    ${divider()}

    <div style="text-align:center;margin-bottom:8px;">
      ${button('Læs mere om Altid Hjem', 'https://altidhjem.dk')}
    </div>
  `

  return {
    subject: 'Hvad er Altid Hjem egentlig?',
    html: baseLayout(content, 'Én app til alle dine faste udgifter i hjemmet').replace(/\{\{email\}\}/g, encodeURIComponent(email)),
  }
}

function feature(emoji: string, title: string, description: string): string {
  return `
    <tr>
      <td style="padding:10px 0;vertical-align:top;width:40px;font-size:22px;">${emoji}</td>
      <td style="padding:10px 0 10px 12px;vertical-align:top;">
        <strong style="font-size:15px;color:#1a1a1a;">${title}</strong><br/>
        <span style="font-size:14px;color:#666;">${description}</span>
      </td>
    </tr>
  `
}
