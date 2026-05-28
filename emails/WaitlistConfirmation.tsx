import { Text } from '@react-email/components'
import React from 'react'
import EmailLayout from './EmailLayout'

interface Props {
  firstName: string
}

export default function WaitlistConfirmation({ firstName }: Props) {
  return (
    <EmailLayout>
      <Text style={heading}>Godt at have dig med</Text>

      <Text style={body}>Hej {firstName},</Text>

      <Text style={body}>
        Altid Hjem samler dine boligudgifter ét sted &ndash; strøm, forsikring,
        internet og alt det andet &ndash; så du får overblikket, vi alle har
        manglet.
      </Text>

      <Text style={body}>
        For at sikre den bedste oplevelse fra start åbner vi appen i mindre
        grupper. Du hører fra os, så snart det er din tur.
      </Text>

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

const closing: React.CSSProperties = {
  fontSize: '16px',
  color: '#003c16',
  lineHeight: '1.7',
  margin: '24px 0 0',
}
