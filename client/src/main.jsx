import { StrictMode,React } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from './components/theme-provider.jsx'
import LandingPage from './components/screens/landingPage/landingPage.jsx'
import AdminPanel from './components/screens/admin/adminPanel.jsx'
import CustomersPanel from './components/screens/customers/customersPanel.jsx'
import MechanicPanel from './components/screens/mechanic/mechanicPanel.jsx'
import Login from './components/screens/auth/login'
import Register from './components/screens/auth/register'
import TestRating from './components/screens/examples/service-review-demo.jsx'
import { Toaster } from './components/ui/sonner.jsx'
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<LandingPage />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/customers" element={<CustomersPanel />} />
      <Route path="/mechanic" element={<MechanicPanel />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test-rating" element={<TestRating />} />
    </Route>
  )
);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster/>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)