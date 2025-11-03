import React from 'react'
import CustomersCard from './components/customersCard'

function CustomersPanel() {
  return (
    
    <>
    <div className='flex flex-col mb-16 h-screen items-center justify-center'>
    <h1 className='text-2xl font-bold mb-16'>This is the customers panel</h1>
    <CustomersCard />
    </div>
    </>
  )
}

export default CustomersPanel