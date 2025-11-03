import React from 'react'
import AdminCard from './components/adminCard'

function AdminPanel() {
  return (
    <>
    <div className='flex flex-col h-screen items-center justify-center'>
    <h1 className='text-2xl font-bold mb-16'>This is the admin panel</h1>
    <div></div>
    <AdminCard />
    </div>
    </>
  )
}

export default AdminPanel