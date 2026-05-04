import {
  Body,
  Column,
  Html,
  Head,
  Img,
  Row,
  Section,
  Text,
} from '@react-email/components'
import React from 'react'
import {
  LOGO_DARK,
  ICON_APP_LIGHT,
  ICON_1,
  ICON_2_1,
  ICON_3,
  ICON_4,
  ICON_5,
  ICON_6,
} from './image-urls'

const ICONS = [
  { src: ICON_5,   alt: 'Hjem' },
  { src: ICON_2_1, alt: 'Forsikring' },
  { src: ICON_1,   alt: 'Ladning' },
  { src: ICON_4,   alt: 'Alarm' },
  { src: ICON_3,   alt: 'Energi' },
  { src: ICON_6,   alt: 'Mobil' },
]

interface Props {
  children: React.ReactNode
}

export default function EmailLayout({ children }: Props) {
  return (
    <Html lang="da">
      <Head />
      <Body style={body}>
        <Section style={wrapper}>

          {/* Header: logo left, sub-brand icons right */}
          <Section style={header}>
            <Row>
              <Column style={{ verticalAlign: 'middle' }}>
                <Img
                  src={LOGO_DARK}
                  width="120"
                  height="64"
                  alt="Altid Hjem"
                />
              </Column>
              <Column style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                {ICONS.map((icon) => (
                  <Img
                    key={icon.alt}
                    src={icon.src}
                    width="36"
                    height="36"
                    alt={icon.alt}
                    style={{ display: 'inline-block', marginLeft: '6px' }}
                  />
                ))}
              </Column>
            </Row>
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer: app icon + tagline only */}
          <Section style={footer}>
            <Img
              src={ICON_APP_LIGHT}
              width="56"
              height="56"
              alt="Altid Hjem"
              style={{ display: 'block', margin: '0 auto 16px' }}
            />
            <Text style={footerTagline}>Bedre råd til hjemmet.</Text>
          </Section>

        </Section>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f4',
  fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: '20px 0',
}

const wrapper: React.CSSProperties = {
  backgroundColor: '#ffffff',
  maxWidth: '600px',
  margin: '0 auto',
}

const header: React.CSSProperties = {
  backgroundColor: '#EDE9DE',
  padding: '20px 28px',
}

const content: React.CSSProperties = {
  padding: '40px 40px 32px',
}

const footer: React.CSSProperties = {
  backgroundColor: '#003c16',
  padding: '40px 32px 36px',
  textAlign: 'center',
}

const footerTagline: React.CSSProperties = {
  color: '#aff193',
  fontSize: '14px',
  textAlign: 'center',
  margin: 0,
}
