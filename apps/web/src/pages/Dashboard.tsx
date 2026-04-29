import { Container, Title, Text, Button, Stack, Tabs } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppointmentCard } from '../components/appointments/AppointmentCard'
import { AppointmentCardSkeleton } from '../components/appointments/AppointmentCardSkeleton'
import { Appointment, PatientInfo } from '../types'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { listAppointmentsRequest, mapApiAppointment } from '../api/appointments'

const DEFAULT_PATIENT_INFO: PatientInfo = {
  dentalInsuranceStatus: 'no_insurance',
  lastDentalVisit: 'never',
  hasDentalPain: false,
}

export const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const apiAppointments = await listAppointmentsRequest()
        setAppointments(apiAppointments.map((appt) => mapApiAppointment(appt, DEFAULT_PATIENT_INFO)))
      } catch {
        setError('Unable to load appointments right now.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadAppointments()
  }, [])

  const visible = appointments.filter((apt) => apt.status !== 'cancelled')
  const upcoming = visible.filter((apt) => dayjs(apt.scheduledStart).isAfter(dayjs()))
  const past = visible.filter((apt) => !dayjs(apt.scheduledStart).isAfter(dayjs()))

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
            {error && <Text c="red">{error}</Text>}
            {isLoading ? (
              <Stack gap="md">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <AppointmentCardSkeleton key={idx} />
                ))}
              </Stack>
            ) : upcoming.length > 0 ? (
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
            {error && <Text c="red">{error}</Text>}
            {isLoading ? (
              <Stack gap="md">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <AppointmentCardSkeleton key={idx} />
                ))}
              </Stack>
            ) : past.length > 0 ? (
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
