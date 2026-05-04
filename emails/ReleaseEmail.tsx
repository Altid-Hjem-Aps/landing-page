import { Column, Img, Link, Row, Section, Text } from '@react-email/components'
import React from 'react'
import EmailLayout from './EmailLayout'
import { PHONE_MOCKUP } from './image-data'

const HAS_PHONE = PHONE_MOCKUP.length > 0

interface Props {
  firstName: string
}

export default function ReleaseEmail({ firstName }: Props) {
  return (
    <EmailLayout>
      <Text style={heading}>I dag åbner vi dørene.</Text>

      <Text style={body}>Hej {firstName},</Text>
      <Text style={body}>
        Altid Hjem-appen er live, og du er en af de første, der får adgang.
      </Text>

      {/* Download CTA box */}
      <Section style={ctaBox}>
        <Row>
          {/* Left: text + badges */}
          <Column style={{ width: HAS_PHONE ? '55%' : '100%', verticalAlign: 'bottom', paddingRight: HAS_PHONE ? '12px' : '0' }}>
            <Text style={ctaLabel}>NU LANCERET</Text>
            <Text style={ctaTitle}>Download Altid Hjem</Text>
            <Row style={{ marginTop: '20px' }}>
              <Column style={{ paddingRight: '8px' }}>
                <Link
                  href="https://play.google.com/store/apps/details?id=dk.altidhjem"
                  style={badge}
                >
                  <span style={badgeSub}>GET IT ON</span>
                  <br />
                  <span style={badgeMain}>Google Play</span>
                </Link>
              </Column>
              <Column>
                <Link
                  href="https://apps.apple.com/dk/app/altid-hjem"
                  style={badge}
                >
                  <span style={badgeSub}>Download on the</span>
                  <br />
                  <span style={badgeMain}>App Store</span>
                </Link>
              </Column>
            </Row>
          </Column>

          {/* Right: phone mockup — added once image is available */}
          {HAS_PHONE && (
            <Column style={{ width: '45%', verticalAlign: 'bottom', textAlign: 'right' }}>
              <Img
                src={PHONE_MOCKUP}
                width="220"
                alt=""
                style={{ display: 'block', marginLeft: 'auto' }}
              />
            </Column>
          )}
        </Row>
      </Section>

      <Text style={body}>
        Vi har brugt lang tid på at gøre den rigtigt. Ikke bare endnu en app. En app der rent
        faktisk gør noget ved problemet: at dine boligudgifter er spredt over alt.
      </Text>
      <Text style={body}>
        Version 1 er bygget op om strøm. Du kan se dit forbrug, dine fakturaer og dine priser
        &ndash; samlet, overskueligt, på din telefon. Det er fundamentet.
      </Text>
      <Text style={body}>Det her er dag ét.</Text>

      <Text style={closing}>
        Mange hilsner
        <br />
        <strong>Werner Valeur</strong>
        <br />
        Grundlægger af Altid Hjem
      </Text>
    </EmailLayout>
  )
}

const heading: React.CSSProperties = {
  fontSize: '36px',
  fontWeight: '800',
  color: '#003c16',
  lineHeight: '1.15',
  margin: '0 0 24px',
}

const body: React.CSSProperties = {
  fontSize: '16px',
  color: '#1a1a1a',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const ctaBox: React.CSSProperties = {
  backgroundColor: '#003c16',
  borderRadius: '8px',
  padding: '28px 24px 0',
  margin: '24px 0',
  overflow: 'hidden',
}

const ctaLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  color: '#b7f2a7',
  margin: '0 0 6px',
  textTransform: 'uppercase',
}

const ctaTitle: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: '800',
  color: '#ffffff',
  lineHeight: '1.2',
  margin: '0 0 4px',
}

const badge: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#000000',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '8px',
  padding: '8px 14px',
  lineHeight: '1.3',
  minWidth: '120px',
}

const badgeSub: React.CSSProperties = {
  display: 'block',
  fontSize: '9px',
  fontWeight: '400',
  color: '#ffffff',
  letterSpacing: '0.02em',
}

const badgeMain: React.CSSProperties = {
  display: 'block',
  fontSize: '15px',
  fontWeight: '700',
  color: '#ffffff',
}

const closing: React.CSSProperties = {
  fontSize: '16px',
  color: '#1a1a1a',
  lineHeight: '1.7',
  margin: '24px 0 0',
}
