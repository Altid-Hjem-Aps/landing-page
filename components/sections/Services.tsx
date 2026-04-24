import { AltidMark } from '@/components/AltidMark'

function Desc({ text }: { text: string }) {
  const [before, after] = text.split('Altid.')
  if (after === undefined) return <>{text}</>
  return <>{before}<AltidMark /></>
}

const services = [
  {
    name: 'Energi',
    desc: '+14.000 kunder. Gennemsigtig strøm til fair pris. Altid.',
    bg: '#8fccff',
    path: 'M20.83,25.03c0,.16-.06.31-.18.42-.11.11-.27.18-.42.18h-6.01c-.16,0-.31-.06-.42-.18-.11-.11-.18-.27-.18-.42s.06-.31.18-.42c.11-.11.27-.18.42-.18h6.01c.16,0,.31.06.42.18.11.11.18.27.18.42ZM23.83,15.42c0,1-.22,1.99-.66,2.89-.44.9-1.08,1.69-1.87,2.31-.15.11-.27.26-.35.43-.08.17-.13.35-.13.54v.45c0,.32-.13.62-.35.85-.23.23-.53.35-.85.35h-4.81c-.32,0-.62-.13-.85-.35-.23-.23-.35-.53-.35-.85v-.45c0-.18-.04-.36-.12-.53-.08-.16-.2-.31-.34-.42-.79-.61-1.42-1.4-1.86-2.29-.44-.9-.67-1.88-.67-2.88-.02-3.58,2.87-6.56,6.45-6.65.88-.02,1.76.13,2.58.46.82.32,1.57.81,2.2,1.42.63.62,1.13,1.35,1.47,2.16.34.81.52,1.69.52,2.57Z',
  },
  {
    name: 'Alarm',
    desc: 'Tryg boligsikring med professionel overvågning. Altid.',
    bg: '#fffa86',
    path: 'M9.49,15.39v8.3c0,.41.33.74.74.74h13.99c.41,0,.74-.33.74-.74v-8.3c0-.64-.34-1.23-.9-1.55l-6.48-3.73c-.23-.13-.51-.13-.74,0l-6.45,3.73c-.55.32-.9.91-.9,1.55ZM8.64,23.69v-8.3c0-.94.5-1.81,1.32-2.28l6.45-3.73c.49-.28,1.09-.28,1.58,0l6.48,3.73c.82.47,1.32,1.34,1.32,2.29v8.3c0,.87-.71,1.58-1.58,1.58h-13.99c-.87,0-1.58-.71-1.58-1.58Z M21.79,17.15h-2.27v4.11h2.27v-4.11ZM22.63,16.31v5.8h-3.96v-5.8h3.96Z',
  },
  {
    name: 'Opladning',
    desc: 'Smart elbilsopladning til hjemmet. Altid.',
    bg: '#a8e063',
    path: 'M18.57,16.91c.06.09.09.18.11.29.01.1,0,.21-.04.3l-1.27,3.17c-.06.16-.18.28-.34.35-.15.07-.33.07-.49,0-.16-.06-.28-.18-.35-.34-.07-.15-.07-.33,0-.49l.92-2.3h-1.6c-.1,0-.21-.03-.3-.07-.09-.05-.17-.12-.23-.21s-.09-.18-.11-.29,0-.21.04-.3l1.27-3.17c.06-.16.18-.28.34-.35s.33-.07.49,0c.16.06.28.18.35.34.07.15.07.33,0,.49l-.92,2.3h1.6c.1,0,.21.03.3.07.09.05.17.12.23.2ZM27.54,13.99v6.44c0,.5-.2.99-.56,1.34-.36.36-.84.56-1.34.56s-.99-.2-1.34-.56c-.36-.36-.56-.84-.56-1.34v-3.17c0-.17-.07-.33-.19-.45-.12-.12-.28-.19-.45-.19h-1.27v6.97h1.27c.17,0,.33.07.45.19.12.12.19.28.19.45s-.07.33-.19.45c-.12.12-.28.19-.45.19h-12.67c-.17,0-.33-.07-.45-.19-.12-.12-.19-.28-.19-.45s.07-.33.19-.45c.12-.12.28-.19.45-.19h1.27v-12.03c0-.5.2-.99.56-1.34.36-.36.84-.56,1.34-.56h6.33c.5,0,.99.2,1.34.56.36.36.56.84.56,1.34v3.8h1.27c.5,0,.99.2,1.34.56.36.36.56.84.56,1.34v3.17c0,.17.07.33.19.45.12.12.28.19.45.19s.33-.07.45-.19c.12-.12.19-.28.19-.45v-6.44c0-.17-.07-.33-.19-.45l-1.53-1.53c-.12-.12-.19-.28-.19-.45s.07-.33.19-.45c.12-.12.28-.19.45-.19s.33.07.45.19l1.53,1.53c.18.18.32.39.41.62.1.23.14.48.14.73Z',
  },
  {
    name: 'Forsikring',
    desc: 'Gennemsigtige forsikringer uden skjulte vilkår. Altid.',
    bg: '#ffbab8',
    path: 'M26.02,16.98c-.14-1.62-.73-3.17-1.71-4.46-.98-1.3-2.3-2.3-3.81-2.89-1.52-.59-3.16-.74-4.76-.43-1.6.3-3.08,1.05-4.27,2.15-1.59,1.46-2.58,3.48-2.76,5.63-.01.17,0,.34.06.5.06.16.14.31.26.44.12.13.26.23.41.3.16.07.33.1.5.1h6.8v4.33c0,.66.26,1.29.72,1.75.46.46,1.09.72,1.75.72s1.29-.26,1.75-.72c.46-.46.72-1.09.72-1.75,0-.16-.07-.32-.18-.44-.12-.12-.27-.18-.44-.18s-.32.07-.44.18c-.12.12-.18.27-.18.44,0,.33-.13.64-.36.87-.23.23-.55.36-.87.36s-.64-.13-.87-.36c-.23-.23-.36-.55-.36-.87v-4.33h6.8c.17,0,.34-.03.5-.1.16-.07.3-.17.42-.3.12-.13.21-.28.26-.44.06-.16.08-.33.06-.51Z',
  },
  {
    name: 'Mobil',
    desc: 'Mobilabonnement på gennemsigtige vilkår. Altid.',
    bg: '#ffbbf8',
    path: 'M20.92,8.6h-7.39c-.49,0-.96.19-1.31.54-.35.35-.54.82-.54,1.31v13.55c0,.49.19.96.54,1.31.35.35.82.54,1.31.54h7.39c.49,0,.96-.19,1.31-.54s.54-.82.54-1.31v-13.55c0-.49-.19-.96-.54-1.31-.35-.35-.82-.54-1.31-.54ZM12.91,12.29h8.62v9.85h-8.62v-9.85Z',
  },
  {
    name: 'Madplan',
    desc: 'Nem madplanlægning tilpasset din husstand. Altid.',
    bg: '#bdb0f9',
    path: 'M21.66,25.59c-1.39,0-2.58-.46-3.51-1.39-.93-.93-1.39-2.12-1.39-3.51s.46-2.58,1.39-3.51c.93-.93,2.12-1.39,3.51-1.39s2.58.46,3.51,1.39c.93.93,1.39,2.12,1.39,3.51s-.46,2.58-1.39,3.51c-.93.93-2.12,1.39-3.51,1.39ZM21.66,24.33c.99,0,1.85-.33,2.58-1.06.73-.73,1.06-1.59,1.06-2.58s-.33-1.85-1.06-2.58-1.59-1.06-2.58-1.06-1.85.33-2.58,1.06-1.06,1.59-1.06,2.58.33,1.85,1.06,2.58,1.59,1.06,2.58,1.06Z',
  },
]

export default function Services() {
  return (
    <section className="py-16 sm:py-24 px-6 sm:px-10 lg:px-12" style={{ background: 'var(--cream)' }}>
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase mb-4" style={{ color: 'var(--text-light)' }}>
          Tjenesterne
        </p>
        <h2
          className="font-extrabold leading-[1.15] tracking-tight mb-4"
          style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--forest)' }}
        >
          Hvad finder du i appen?
        </h2>
        <p className="text-lg leading-relaxed mb-12" style={{ color: 'var(--text-mid)', maxWidth: 560 }}>
          Nøje udvalgte tjenester til hjemmet – valgt på baggrund af kvalitet, pris og gennemsigtighed.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s) => (
            <div
              key={s.name}
              className="bg-white rounded-2xl p-6 flex items-start gap-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              style={{ borderColor: 'rgba(27,104,64,0.06)', boxShadow: '0 2px 8px rgba(27,104,64,0.04)', position: 'relative', overflow: 'visible' }}
            >
              {/* Altid Energi stamp — only on the Energi card */}
              {s.name === 'Energi' && (
                <div
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    background: 'var(--forest)',
                    borderRadius: 8,
                    padding: '7px 12px',
                    transform: 'rotate(4deg)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    zIndex: 10,
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 225 137.3" style={{ height: 22, width: 'auto', display: 'block' }}>
                    <path fill="#8fccff" d="M220.5,0v78.4h-10.6v-10.1c-3.2,5.9-9.6,11.8-21.5,11.8-18.1,0-29.6-14-29.6-30.6s12.9-30.4,29.4-30.4,19,6.6,21.3,11.1V0h11ZM169.8,49.5h0c.1,10.7,7.5,20.4,20.2,20.4s10.8-2.3,14.4-6c3.7-3.7,5.8-8.8,5.6-14.5,0-5.7-2.2-10.7-5.8-14.2-3.6-3.6-8.6-5.7-14.2-5.7-12.2,0-20.2,9.3-20.2,20.1Z"/>
                    <path fill="#8fccff" d="M136.6,11.7V0h11v11.7h-11ZM136.6,78.4V20.8h11v57.7h-11Z"/>
                    <path fill="#8fccff" d="M106.2,78.4V29.4h-10.4v-8.6h10.4V0h11v20.8h11.1v8.6h-11.1v49.1h-11Z"/>
                    <path fill="#8fccff" d="M76.6,78.4V0h11v78.4h-11Z"/>
                    <path fill="#8fccff" d="M62,20.8v57.7h-11v-10.1c-4,7.7-12.3,11.8-21.4,11.8-18.5,0-29.6-14.4-29.6-30.5s12.8-30.5,29.6-30.5,18.8,6.4,21.4,11.9v-10.2h11ZM11,49.7h0c.1,8.7,6.1,20.1,20.1,20.1s15.1-4.9,17.9-11.4c1.3-2.6,1.9-5.6,2-8.6.1-3-.4-5.9-1.7-8.6-2.8-6.7-9.2-11.9-18.4-11.9s-19.9,9.5-19.9,20.4Z"/>
                    <text x="116.1" y="124.7" fill="white" fontFamily="Onest, system-ui, sans-serif" fontSize="36" fontWeight="500">energi</text>
                  </svg>
                </div>
              )}

              <svg className="w-12 h-12 shrink-0" viewBox="0 0 34.44 34.44">
                <circle cx="17.22" cy="17.22" r="17.22" fill={s.bg}/>
                <path fill="#003c16" d={s.path}/>
              </svg>
              <div>
                <p className="text-[17px] font-semibold mb-1" style={{ color: 'var(--forest)' }}>{s.name}</p>
                <p className="text-[13px] leading-snug" style={{ color: 'var(--text-light)' }}><Desc text={s.desc} /></p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-[15px] italic" style={{ color: 'var(--text-light)' }}>
          – Og meget mere.
        </p>
      </div>
    </section>
  )
}
