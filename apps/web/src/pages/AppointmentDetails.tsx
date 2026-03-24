import {
  Container,
  Title,
  Stack,
  Paper,
  Group,
  Badge,
  Button,
  Modal,
  Textarea,
  Text,
} from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { MdCalendarToday, MdLocationOn } from 'react-icons/md'
import dayjs from 'dayjs'
import { cancelAppointmentRequest, getAppointmentRequest } from '../api/appointments'
import { listLocationsRequest } from '../api/locations'
import { AppointmentDetailsSkeleton } from '../components/appointments/AppointmentDetailsSkeleton'
import { ApiAppointment, Location } from '../types'

const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  confirmed: 'green',
  checked_in: 'cyan',
  in_progress: 'teal',
  completed: 'blue',
  cancelled: 'red',
  no_show: 'gray',
}

export const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openedModal, setOpenedModal] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [appointment, setAppointment] = useState<ApiAppointment | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      setIsLoading(true)
      setError(null)
      try {
        const [appt, apiLocations] = await Promise.all([getAppointmentRequest(id), listLocationsRequest()])
        setAppointment(appt)
        setLocations(
          apiLocations.map((loc) => ({
            id: loc.id,
            name: loc.name,
            address: loc.address ?? '',
            city: loc.city ?? '',
            state: loc.state ?? '',
            phone: loc.phone ?? '',
          }))
        )
      } catch {
        setError('Unable to load appointment details.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadData()
  }, [id])

  const location = useMemo(
    () => locations.find((loc) => loc.id === appointment?.location_id) ?? null,
    [appointment?.location_id, locations]
  )
  
  const locationName = appointment?.location_name || location?.name

  const handleReschedule = () => {
    setOpenedModal(null)
    navigate('/book', { state: { rescheduleAppointmentId: id } })
  }

  const handleCancel = async () => {
    if (!id) return
    try {
      const updated = await cancelAppointmentRequest(id, { reason: cancelReason || undefined })
      setAppointment(updated)
      setOpenedModal(null)
      setCancelReason('')
    } catch {
      setError('Unable to cancel appointment.')
    }
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Text c="red">{error}</Text>
      </Container>
    )
  }

  if (isLoading || !appointment) {
    return <AppointmentDetailsSkeleton />
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Button variant="subtle" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>

        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={2}>Appointment Details</Title>
            <Badge color={STATUS_COLORS[appointment.status] ?? 'gray'}>{appointment.status}</Badge>
          </Group>

          <Stack gap="md">
            <Group gap="xs">
              <MdCalendarToday style={{ fontSize: 24, color: 'teal' }} />
              <div>
                <Text fw={600}>{dayjs(appointment.scheduled_start).format('MMM D, YYYY')}</Text>
                <Text size="sm" c="dimmed">
                  {dayjs(appointment.scheduled_start).format('h:mm A')}
                </Text>
              </div>
            </Group>

            <Group gap="xs">
              <MdLocationOn style={{ fontSize: 24, color: 'teal' }} />
              <div>
                <Text fw={600}>{locationName ?? appointment.location_id}</Text>
                <Text size="sm" c="dimmed">
                  {[location?.address, location?.city, location?.state].filter(Boolean).join(', ')}
                </Text>
              </div>
            </Group>
          </Stack>
        </Paper>

        <Group gap="md">
          <Button onClick={() => setOpenedModal('reschedule')}>Reschedule Appointment</Button>
          <Button
            variant="light"
            color="red"
            onClick={() => setOpenedModal('cancel')}
            disabled={appointment.status === 'cancelled'}
          >
            Cancel Appointment
          </Button>
        </Group>

        <Modal
          opened={openedModal === 'reschedule'}
          onClose={() => setOpenedModal(null)}
          title="Reschedule Appointment"
        >
          <Stack gap="md">
            <Text c="dimmed">
              Select a new date and time on the booking page. We will preserve this appointment record.
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setOpenedModal(null)}>
                Close
              </Button>
              <Button onClick={handleReschedule}>Continue to Booking</Button>
            </Group>
          </Stack>
        </Modal>

        <Modal opened={openedModal === 'cancel'} onClose={() => setOpenedModal(null)} title="Cancel Appointment">
          <Stack gap="md">
            <Textarea
              label="Reason for cancellation (optional)"
              placeholder="Tell us why you're cancelling..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.currentTarget.value)}
            />
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setOpenedModal(null)}>
                Keep Appointment
              </Button>
              <Button color="red" onClick={handleCancel}>
                Confirm Cancellation
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  )
}
