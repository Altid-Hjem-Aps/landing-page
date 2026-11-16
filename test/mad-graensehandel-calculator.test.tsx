import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import GraensehandelCalculator from '@/components/mad/GraensehandelCalculator'

// The border-trade calculator moved from altidmad.dk (/graensehandel-beregner). Same maths and
// defaults as there: 100 km at 15 km/l and 17,69 kr./l is about 118 kr.
const field = (label: string) => screen.getByLabelText(label) as HTMLInputElement
const type = (label: string, value: string) => fireEvent.change(field(label), { target: { value } })

describe('GraensehandelCalculator', () => {
  it('shows the fuel cost for the default trip', () => {
    render(<GraensehandelCalculator />)
    expect(field('Kørsel tur-retur (km)').value).toBe('100')
    expect(screen.getByText('Ca. 118 kr.')).toBeInTheDocument()
  })

  it('says the trip pays off when the expected saving beats the fuel', () => {
    render(<GraensehandelCalculator />)
    type('Forventet besparelse (kr.)', '200')
    expect(screen.getByText('På papiret: ja')).toBeInTheDocument()
  })

  it('says it does not when the saving is smaller than the fuel', () => {
    render(<GraensehandelCalculator />)
    type('Forventet besparelse (kr.)', '50')
    expect(screen.getByText('På papiret: nej')).toBeInTheDocument()
  })

  it('marks an unreadable value invalid only after the field is left, and stops the sum', () => {
    render(<GraensehandelCalculator />)
    type('Bilens forbrug (km/l)', 'abc')
    expect(field('Bilens forbrug (km/l)')).not.toHaveAttribute('aria-invalid')
    fireEvent.blur(field('Bilens forbrug (km/l)'))
    expect(field('Bilens forbrug (km/l)')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Udfyld kørsel, forbrug og pris')).toBeInTheDocument()
  })
})
