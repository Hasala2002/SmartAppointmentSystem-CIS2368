import { Container, Title, Text, Button, Stack, Group, Tabs, Empty } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppointmentCard } from '../components/appointments/AppointmentCard'
import { Appointment } from '../types'
import dayjs from 'dayjs'

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    userId: '1',
    locationId: '1',
    date: dayjs().add(1, 'day').format('MMM DD, YYYY'),
    time: '10:00 AM',
    status: 'confirmed',
    patientInfo: {
      dateOfBirth: '1990-05-15',
      hasInsurance: 'yes',
      lastDentalVisit: 'within-6-months',
      hasDentalPain: 'no',
    },
  },
  {
    id: '2',
    userId: '1',
    locationId: '2',
    date: dayjs().subtract(7, 'days').format('MMM DD, YYYY'),
    time: '2:00 PM',
    status: 'completed',
    patientInfo: {
      dateOfBirth: '1990-05-15',
      hasInsurance: 'yes',
      lastDentalVisit: 'within-6-months',
      hasDentalPain: 'no',
    },
  },
]

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const upcoming = DUMMY_APPOINTMENTS.filter(apt => new Date(apt.date) >= new Date())
  const past = DUMMY_APPOINTMENTS.filter(apt => new Date(apt.date) < new Date())

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Welcome Section */}
        <div>
          <Title order={1} mb="xs">
            Welcome back, {user?.firstName}!
          </Title>
          <Text c="dimmed" mb="lg">
            Manage your dental appointments
          </Text>
          <Button onClick={() => navigate('/book')}>
            Book New Appointment
          </Button>
        </div>

        {/* Appointments Section */}
        <Tabs defaultValue="upcoming">
          <Tabs.List>
            <Tabs.Tab value="upcoming">
              Upcoming Appointments ({upcoming.length})
            </Tabs.Tab>
            <Tabs.Tab value="past">
              Past Appointments ({past.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="upcoming" pt="lg">
            {upcoming.length > 0 ? (
              <Stack gap="md">
                {upcoming.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </Stack>
            ) : (
              <Stack gap="md" align="center" py="xl">
                <Text c="dimmed">No upcoming appointments</Text>
                <Button onClick={() => navigate('/book')}>
                  Book your first appointment
                </Button>
              </Stack>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="past" pt="lg">
            {past.length > 0 ? (
              <Stack gap="md">
                {past.map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} />
                ))}
              </Stack>
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No past appointments
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  )
}
