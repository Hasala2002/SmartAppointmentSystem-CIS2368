import { Stack, NavLink, Group, Badge, ScrollArea, Divider } from '@mantine/core'
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
          rightSection={<Badge size="xs">Coming Soon</Badge>}
        />

        <Divider my="md" />

        {/* Management Section */}
        <Group px="sm" mb="xs">
          <Badge size="xs" variant="light" color="gray">
            MANAGEMENT
          </Badge>
        </Group>

        <NavLink
          label="Staff"
          leftSection={<PersonAdd color="currentColor" />}
          disabled
          opacity={0.5}
          style={{ cursor: 'not-allowed' }}
          rightSection={<Badge size="xs" variant="light">Soon</Badge>}
        />
        <NavLink
          label="Locations"
          leftSection={<Location color="currentColor" />}
          disabled
          opacity={0.5}
          style={{ cursor: 'not-allowed' }}
          rightSection={<Badge size="xs" variant="light">Soon</Badge>}
        />

        <Divider my="md" />

        {/* Settings */}
        <NavLink
          label="Settings"
          leftSection={<SettingsIcon color="currentColor" />}
          disabled
          opacity={0.5}
          style={{ cursor: 'not-allowed' }}
          rightSection={<Badge size="xs" variant="light">Soon</Badge>}
        />
      </Stack>
    </ScrollArea>
  )
}
