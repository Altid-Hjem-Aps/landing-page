import { Column, Img, Row, Section, Text } from '@react-email/components'
import React from 'react'
import EmailLayout from './EmailLayout'
import { ICON_APP_DARK } from './image-data'

interface Props {
  firstName: string
}

export default function WaitlistConfirmation({ firstName }: Props) {
  return (
    <EmailLayout>
      <Text style={heading}>Godt at have dig med.</Text>

      <Text style={body}>Hej {firstName},</Text>
      <Text style={body}>
        Vi skriver til dig, når Altid Hjem-appen er klar til download.
      </Text>

      {/* Info box with app icon */}
      <Section style={infoBox}>
        <Row>
          <Column style={{ width: '56px', verticalAlign: 'middle', paddingRight: '16px' }}>
            <Img src={ICON_APP_DARK} width="52" height="48" alt="" />
          </Column>
          <Column style={{ verticalAlign: 'middle' }}>
            <Text style={infoLabel}>LANCERING</Text>
            <Text style={infoDate}>27. maj 2026</Text>
          </Column>
        </Row>
      </Section>

      <Text style={body}>Indtil da holder vi dig opdateret.</Text>

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
  color: '#003c16',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const infoBox: React.CSSProperties = {
  borderLeft: '4px solid #003c16',
  backgroundColor: '#eaf6e8',
  borderRadius: '4px',
  padding: '16px 18px',
  margin: '24px 0',
}

const infoLabel: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  color: '#003c16',
  margin: '0 0 4px',
  textTransform: 'uppercase',
}

const infoDate: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#003c16',
  margin: 0,
}

const closing: React.CSSProperties = {
  fontSize: '16px',
  color: '#003c16',
  lineHeight: '1.7',
  margin: '24px 0 0',
}
