import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './components/screens/landingPage/landingPage'
import AdminPanel from './components/screens/admin/adminPanel'
import CustomersPanel from './components/screens/customers/customersPanel'
import MechanicPanel from './components/screens/mechanic/mechanicPanel'
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
        <ModeToggle/>
      </header>
      <main className='w-full mx-auto'>
        <Outlet />
      </main>
    </>
  )
}

export default App
