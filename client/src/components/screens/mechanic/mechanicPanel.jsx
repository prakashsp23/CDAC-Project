import React from 'react'
import MechanicCard from './components/mechanicCard'
import { Section } from '../../ui/section'

function MechanicPanel() {
  return (
    <>
    <Section className='flex flex-col items-center justify-center'>
    <h1 className='text-2xl font-bold mb-16'>This is the mechanic panel</h1>
    <MechanicCard />
    </Section>
    </>
  )
}

export default MechanicPanel