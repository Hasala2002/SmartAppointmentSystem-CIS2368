import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import { AdminShell } from './components/layout/AdminShell'
import { Login } from './pages/Login'
import { ForgotPassword } from './pages/ForgotPassword'
import { ResetPassword } from './pages/ResetPassword'
import { Dashboard } from './pages/Dashboard'
import { Appointments } from './pages/Appointments'
import { AppointmentDetails } from './pages/AppointmentDetails'
import { Queue } from './pages/Queue'
import { Staff } from './pages/Staff'
import { Locations } from './pages/Locations'
import { Settings } from './pages/Settings'
import { useAuthStore } from './stores/authStore'

const theme = createTheme({
  primaryColor: 'teal',
  defaultRadius: 'md',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101102'
    ]
  }
})

function App() {
  const { isAuthenticated, user } = useAuthStore()
  const isStaff = isAuthenticated && user?.role === 'staff'
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route element={isStaff ? <AdminShell /> : <Navigate to="/login" replace />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/appointments/:id" element={<AppointmentDetails />} />
            <Route path="/queue" element={<Queue />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
