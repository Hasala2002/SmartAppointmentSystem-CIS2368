import { Stack, Paper, Group, SimpleGrid, Button, Title, Text, Badge } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { StatsCardRow } from '../components/common/StatsCard'
import { AppointmentsTable } from '../components/appointments/AppointmentsTable'
import { mockAppointments } from '../data/mockData'
import { Checkmark, CloseCircle, CheckmarkCircle, Time } from 'react-ionicons'
import dayjs from 'dayjs'

export function Dashboard() {
  const navigate = useNavigate()
  const today = dayjs().format('YYYY-MM-DD')

  // Filter today's appointments
  const todaysAppointments = mockAppointments.filter(
    (apt) => dayjs(apt.scheduledStart).format('YYYY-MM-DD') === today
  )

  const stats = [
    {
      icon: <Time color="currentColor" />,
      value: todaysAppointments.length,
      label: "Today's Appointments"
    },
    {
      icon: <Checkmark color="currentColor" />,
      value: todaysAppointments.filter((a) => a.status === 'checked_in').length,
      label: 'Checked In'
    },
    {
      icon: <CheckmarkCircle color="currentColor" />,
      value: todaysAppointments.filter((a) => a.status === 'completed').length,
      label: 'Completed'
    },
    {
      icon: <CloseCircle color="currentColor" />,
      value: todaysAppointments.filter((a) => a.status === 'no_show').length,
      label: 'No Shows'
    }
  ]

  const handleViewAll = () => {
    navigate('/appointments')
  }

  const handleRowClick = (id: string) => {
    navigate(`/appointments/${id}`)
  }

  return (
    <Stack gap="lg">
      <PageHeader title={`Welcome to Smile Dental Admin`} subtitle="Manage your appointments and practice efficiently" />

      <StatsCardRow cards={stats} />

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {/* Main Content */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Paper p="md" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Today's Schedule</Title>
              <Button variant="subtle" size="xs" onClick={handleViewAll}>
                View All
              </Button>
            </Group>
            <AppointmentsTable appointments={todaysAppointments.slice(0, 8)} onRowClick={handleRowClick} />
          </Paper>
        </div>
      </SimpleGrid>

      {/* Quick Actions */}
      <Paper p="md" radius="md" withBorder>
        <Title order={3} mb="md">
          Quick Actions
        </Title>
        <Group>
          <Button variant="light" onClick={() => navigate('/appointments')}>
            Check In Patient
          </Button>
          <Button variant="light" onClick={() => navigate('/appointments')}>
            Mark No-Show
          </Button>
          <Button variant="light" onClick={() => navigate('/queue')}>
            View Queue
          </Button>
        </Group>
      </Paper>
    </Stack>
  )
}
