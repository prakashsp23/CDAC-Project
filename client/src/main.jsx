import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.jsx"
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, createRoutesFromElements, Outlet, Route, RouterProvider } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider.jsx"
import LandingPage from "./components/screens/landingPage/landingPage.jsx"
import AdminPanel from "./components/screens/admin/adminPanel.jsx"
import FeedbackPage from "./components/screens/admin/Pages/Feedback.jsx"
import ServiceRequestsTable from "./components/screens/admin/Pages/ServiceRequests.jsx"
import MechanicsPage from "./components/screens/admin/Pages/MechanicsPage/MechanicsPage.jsx";
import Login from "./components/screens/auth/login.jsx"
import Register from "./components/screens/auth/register.jsx"
import ProfilePage from "./components/screens/ProfilePage.jsx"
import { Toaster } from "./components/ui/sonner.jsx"
import ProtectedLayout from "./components/layouts/ProtectedLayout.jsx"
import AuthLayout from "./components/layouts/AuthLayout.jsx"
import RoleProtectedRoute from "./components/layouts/RoleProtectedRoute.jsx"
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
import AssignedJobs from "./components/screens/mechanic/components/AssignedJobs.jsx"
import { Provider } from 'react-redux'
import { store } from './store'
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./query/queryClient.js"
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
        {/* Admin routes - only accessible by ADMIN */}
        <Route path="/admin" element={
          <RoleProtectedRoute allowedRoles={['ADMIN']}>
            <Outlet />
          </RoleProtectedRoute>
        }>
          <Route index element={<AdminPanel />} />
          <Route path="mechanics" element={<MechanicsPage />} />
          <Route path="service-requests" element={<ServiceRequestsTable />} />
          <Route path="feedback" element={<FeedbackPage />} />
        </Route>

        {/* Customer routes - only accessible by CUSTOMER */}
        <Route path="/customers" element={
          <RoleProtectedRoute allowedRoles={['CUSTOMER']}>
            <Outlet />
          </RoleProtectedRoute>
        }>
          <Route index element={<CustomerDashboard />} />
          <Route path="table" element={<CustomerTable />} />
          <Route path="allservices" element={<AllServicesPage />} />
          <Route path="myservices" element={<MyServicesPage />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="feedback" element={<FeedBackPage />} />
        </Route>

        {/* Mechanic routes - only accessible by MECHANIC */}
        <Route path="/mechanic" element={
          <RoleProtectedRoute allowedRoles={['MECHANIC']}>
            <Outlet />
          </RoleProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="work-history" element={<WorkHistory />} />
          <Route path="assigned-jobs" element={<AssignedJobs />} />
        </Route>

        {/* Profile - accessible by all authenticated users */}
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Route>,
  ),
)

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Toaster />
          <NuqsAdapter>
            <RouterProvider router={router} />
          </NuqsAdapter>
        </ThemeProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)