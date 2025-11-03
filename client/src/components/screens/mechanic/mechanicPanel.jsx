import React from 'react'
import MechanicCard from './components/mechanicCard'

function MechanicPanel() {
  return (
    <>
    <div className='flex flex-col h-screen items-center justify-center'>
    <h1 className='text-2xl font-bold mb-16'>This is the mechanic panel</h1>
    <MechanicCard />
    </div>
    </>
  )
}

export default MechanicPanel