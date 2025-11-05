import React from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import { ModeToggle } from './components/mode-toggle'

function App() {

  return (
    <>
      {/* <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/customers" element={<CustomersPanel />} />
          <Route path="/mechanic" element={<MechanicPanel />} />
        </Routes>
      </div> */}
      <header>
        <ModeToggle />
      </header>
      <main className='w-full mx-auto -mt-10'>
        <Outlet />
      </main>
    </>
  )
}

export default App
