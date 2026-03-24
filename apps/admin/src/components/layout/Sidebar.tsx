import { Stack, NavLink, Badge, ScrollArea } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Grid,
  Calendar,
  People,
  PersonAdd,
  Location,
  Settings as SettingsIcon
} from 'react-ionicons'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Stack gap={0} p="md">
        {/* Main Navigation */}
        <NavLink
          label="Dashboard"
          leftSection={<Grid color="currentColor" />}
          active={isActive('/')}
          onClick={() => navigate('/')}
          fw={isActive('/') ? 600 : 400}
        />
        <NavLink
          label="Appointments"
          leftSection={<Calendar color="currentColor" />}
          active={isActive('/appointments')}
          onClick={() => navigate('/appointments')}
          fw={isActive('/appointments') ? 600 : 400}
        />
        <NavLink
          label="Queue"
          leftSection={<People color="currentColor" />}
          active={isActive('/queue')}
          onClick={() => navigate('/queue')}
          fw={isActive('/queue') ? 600 : 400}
        />
      </Stack>
    </ScrollArea>
  )
}
