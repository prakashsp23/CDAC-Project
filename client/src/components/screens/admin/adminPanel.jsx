import React from 'react'
import AdminCard from './components/adminCard'
import Dashboard from './Pages/Dashboard'
function AdminPanel() {
  return (
    <>
      <div className='flex flex-col h-screen items-center justify-center'>
        <div></div>
        <Dashboard />
      </div>
    </>
  )
}

export default AdminPanel