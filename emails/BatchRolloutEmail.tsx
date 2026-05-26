import { Text } from '@react-email/components'
import React from 'react'
import EmailLayout from './EmailLayout'

interface Props {
  firstName: string
}

export default function BatchRolloutEmail({ firstName }: Props) {
  return (
    <EmailLayout>
      <Text style={heading}>Større interesse end vi turde håbe</Text>

      <Text style={body}>Hej {firstName},</Text>

      <Text style={body}>Tak fordi du skrev dig op til Altid Hjem.</Text>

      <Text style={body}>
        Tilmeldingerne til ventelisten har været langt over, hvad vi havde
        regnet med. Derfor har vi besluttet at åbne adgangen til app&rsquo;en i
        mindre grupper &ndash; så vi kan være sikre på, at oplevelsen bliver god
        for hver enkelt af jer fra første øjeblik.
      </Text>

      <Text style={body}>
        Det første hold er udvalgt tilfældigt blandt alle på ventelisten. Du er
        desværre ikke med i denne omgang.
      </Text>

      <Text style={body}>
        Du står stadig på listen, og vi åbner løbende for nye grupper. Du hører
        fra os, så snart det er din tur.
      </Text>

      <Text style={body}>
        Du skal ikke gøre noget. Imens holder vi dig opdateret om, hvor vi er.
      </Text>

      <Text style={body}>Tak fordi du venter på os.</Text>

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
