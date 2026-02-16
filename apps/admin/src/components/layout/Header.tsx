import {
  Group,
  Burger,
  Text,
  Select,
  ActionIcon,
  Menu,
  Avatar,
  Indicator,
  Paper,
  useMantineTheme
} from '@mantine/core'
import { useState } from 'react'
import { Notifications, LogOut } from 'react-ionicons'
import { LOCATIONS } from '../../types'
import { useAuthStore } from '../../stores/authStore'

interface HeaderProps {
  opened: boolean
  toggle: () => void
}

export function Header({ opened, toggle }: HeaderProps) {
  const theme = useMantineTheme()
  const [selectedLocation, setSelectedLocation] = useState<string | null>('all')
  const logout = useAuthStore((state) => state.logout)

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    ...LOCATIONS.map((loc) => ({ value: loc.id, label: loc.name }))
  ]

  const handleLogout = () => {
    logout()
    // Navigate to login in the future
    console.log('Logging out...')
  }

  return (
    <Group h="100%" px="md" justify="space-between">
      {/* Left Side */}
      <Group gap={0}>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Text fw={600} size="lg" ml="md">
          Smile Dental Admin
        </Text>
      </Group>

      {/* Center - Location Selector */}
      <Select
        placeholder="Select location"
        data={locationOptions}
        value={selectedLocation}
        onChange={setSelectedLocation}
        searchable
        clearable={false}
        style={{ minWidth: 200 }}
        hiddenFrom="sm"
      />

      {/* Right Side */}
      <Group gap="lg">
        {/* Notifications */}
        <ActionIcon variant="subtle" color="gray" size="lg" pos="relative">
          <Notifications color="currentColor" />
          <Indicator color="red" size={8} offset={-5} position="top-end" />
        </ActionIcon>

        {/* Admin Menu */}
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <Avatar size={28} radius="xl" color="teal">
                AD
              </Avatar>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item disabled>Admin Profile</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={handleLogout} leftSection={<LogOut size="16px" />}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  )
}
