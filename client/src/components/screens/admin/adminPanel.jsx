import React from 'react'
import AdminCard from './components/adminCard'
import Dashboard from './Pages/Dashboard'
import MechanicsPage from './Pages/MechanicsPage/MechanicsPage'
function AdminPanel() {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div></div>
        <MechanicsPage />
        {/* <Dashboard /> */}
        </div>
    </>
  )
}

export default AdminPanel