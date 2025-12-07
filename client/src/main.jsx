// import { StrictMode,React } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
// import { ThemeProvider } from './components/theme-provider.jsx'
// import LandingPage from './components/screens/landingPage/landingPage.jsx'
// import AdminPanel from './components/screens/admin/adminPanel.jsx'
// import CustomersPanel from './components/screens/customers/customersPanel.jsx'
// import MechanicPanel from './components/screens/mechanic/mechanicPanel.jsx'
// import Login from './components/screens/auth/login.jsx'
// import Register from './components/screens/auth/register.jsx'
// import ProfilePage from './components/screens/ProfilePage.jsx'
// import { Toaster } from './components/ui/sonner.jsx'

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <Route path="/" element={<App />}>
//       <Route index element={<LandingPage />} />
//       <Route path="/admin" element={<AdminPanel />} />
//       <Route path="/customers" element={<CustomersPanel />} />
//       <Route path="/mechanic" element={<MechanicPanel />} />
//       <Route path="/login" element={<Login />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/profile" element={<ProfilePage />} />
//     </Route>
//   )
// );
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
//       <Toaster/>
//       <RouterProvider router={router} />
//     </ThemeProvider>
//   </StrictMode>,
// )
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider.jsx"
import LandingPage from "./components/screens/landingPage/landingPage.jsx"
import AdminPanel from "./components/screens/admin/adminPanel.jsx"
import FeedbackPage from "./components/screens/admin/Pages/Feedback.jsx"
import ServiceRequestsTable from "./components/screens/admin/Pages/ServiceRequests.jsx"

import MechanicPanel from "./components/screens/mechanic/mechanicPanel.jsx"
import Login from "./components/screens/auth/login.jsx"
import Register from "./components/screens/auth/register.jsx"
import ProfilePage from "./components/screens/ProfilePage.jsx"
import { Toaster } from "./components/ui/sonner.jsx"
import ProtectedLayout from "./components/layouts/ProtectedLayout.jsx"
import AuthLayout from "./components/layouts/AuthLayout.jsx"
// import { NuqsAdapter } from 'nuqs/adapters/react'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6'
import CustomerTable from "./components/screens/customers/customerTable.jsx"
import CustomerDashboard from "./components/screens/customers/CustomerDashboard.jsx"
import MyServicesPage from "./components/screens/customers/MyServicesPage.jsx"
import MyVehicles from "./components/screens/customers/MyVehicles.jsx"
import AllServicesPage from "./components/screens/customers/AllServicesPage.jsx"
import FeedBackPage from "./components/screens/customers/ServiceFeedback.jsx"

import Dashboard from "./components/screens/mechanic/components/dashboard.jsx"
import WorkHistory from "./components/screens/mechanic/components/workhistory.jsx"

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Auth Routes - without sidebar */}
      <Route element={<AuthLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>
      <Route element={<ProtectedLayout />}>
        <Route path="/admin" element={<Outlet />}>
          <Route index element={<AdminPanel />} />
          <Route path="service-requests" element={<ServiceRequestsTable />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>
        <Route path="/customers" element={<Outlet />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="table" element={<CustomerTable />} />
          <Route path="allservices" element={<AllServicesPage />} />
          <Route path="myservices" element={<MyServicesPage />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="feedback" element={<FeedBackPage />} />
        </Route>
        <Route path="/mechanic" element={<Outlet />} >
            <Route index element={<Dashboard/>} />
            <Route path="work-history" element={<WorkHistory />} />
        </Route>
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>,
  ),
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Toaster />
      <NuqsAdapter>
        <RouterProvider router={router} />
      </NuqsAdapter>
    </ThemeProvider>
  </StrictMode>,
)