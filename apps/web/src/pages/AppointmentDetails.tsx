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
  Collapse,
  Text,
  Divider,
} from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { MdCalendarToday, MdAccessTime, MdLocationOn } from 'react-icons/md'

const STATUS_COLORS = {
  confirmed: 'green',
  pending: 'yellow',
  completed: 'blue',
  cancelled: 'red',
}

const VISIT_OPTIONS = {
  'within-6-months': 'Within 6 months',
  '6-12-months': '6-12 months',
  'over-a-year': 'Over a year',
  'never': 'Never',
}

export const AppointmentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [openedModal, setOpenedModal] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  // Dummy appointment data
  const appointment = {
    id: id || '1',
    date: 'Feb 10, 2026',
    time: '10:00 AM',
    status: 'confirmed' as const,
    location: 'Houston - Downtown',
    address: '123 Main St, Houston, TX 77002',
    patientInfo: {
      dateOfBirth: '1990-05-15',
      hasInsurance: 'yes' as const,
      lastDentalVisit: 'within-6-months' as const,
      hasDentalPain: 'no' as const,
      allergies: '',
      additionalNotes: 'Sensitive teeth',
    },
  }

  const handleReschedule = () => {
    setOpenedModal(null)
    navigate('/book')
  }

  const handleCancel = () => {
    setOpenedModal(null)
    setCancelReason('')
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Button variant="subtle" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </Button>

        {/* Appointment Header */}
        <Paper p="lg" radius="md" withBorder>
          <Group justify="space-between" mb="md">
            <Title order={2}>Appointment Details</Title>
            <Badge color={STATUS_COLORS[appointment.status]}>
              {appointment.status}
            </Badge>
          </Group>

          <Stack gap="md">
            {/* Date & Time */}
            <Group gap="xs">
              <MdCalendarToday style={{ fontSize: 24, color: 'teal' }} />
              <div>
                <Text fw={600}>{appointment.date}</Text>
                <Text size="sm" c="dimmed">
                  {appointment.time}
                </Text>
              </div>
            </Group>

            {/* Location */}
            <Group gap="xs">
              <MdLocationOn style={{ fontSize: 24, color: 'teal' }} />
              <div>
                <Text fw={600}>{appointment.location}</Text>
                <Text size="sm" c="dimmed">
                  {appointment.address}
                </Text>
              </div>
            </Group>
          </Stack>
        </Paper>

        {/* Patient Information */}
        <Paper p="lg" radius="md" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Patient Information</Title>
              <Button variant="subtle" size="xs" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? 'Hide' : 'Show'} Details
              </Button>
            </Group>

            <Collapse in={showDetails}>
              <Stack gap="md">
                <Group>
                  <Text fw={500} w="40%">
                    Date of Birth:
                  </Text>
                  <Text>{appointment.patientInfo.dateOfBirth}</Text>
                </Group>
                <Divider />

                <Group>
                  <Text fw={500} w="40%">
                    Dental Insurance:
                  </Text>
                  <Text>{appointment.patientInfo.hasInsurance === 'yes' ? 'Yes' : 'No'}</Text>
                </Group>
                <Divider />

                <Group>
                  <Text fw={500} w="40%">
                    Last Dental Visit:
                  </Text>
                  <Text>{VISIT_OPTIONS[appointment.patientInfo.lastDentalVisit]}</Text>
                </Group>
                <Divider />

                <Group>
                  <Text fw={500} w="40%">
                    Dental Pain:
                  </Text>
                  <Text>{appointment.patientInfo.hasDentalPain === 'yes' ? 'Yes' : 'No'}</Text>
                </Group>

                {appointment.patientInfo.additionalNotes && (
                  <>
                    <Divider />
                    <Group>
                      <Text fw={500} w="40%">
                        Additional Notes:
                      </Text>
                      <Text>{appointment.patientInfo.additionalNotes}</Text>
                    </Group>
                  </>
                )}
              </Stack>
            </Collapse>
          </Stack>
        </Paper>

        {/* Action Buttons */}
        <Group gap="md">
          <Button onClick={() => setOpenedModal('reschedule')}>
            Reschedule Appointment
          </Button>
          <Button variant="light" color="red" onClick={() => setOpenedModal('cancel')}>
            Cancel Appointment
          </Button>
        </Group>

        {/* Reschedule Modal */}
        <Modal opened={openedModal === 'reschedule'} onClose={() => setOpenedModal(null)} title="Reschedule Appointment">
          <Stack gap="md">
            <Text c="dimmed">
              Select a new date and time for your appointment. You'll be taken to the booking page.
            </Text>
            <Group justify="flex-end" gap="sm">
              <Button variant="light" onClick={() => setOpenedModal(null)}>
                Cancel
              </Button>
              <Button onClick={handleReschedule}>
                Continue to Booking
              </Button>
            </Group>
          </Stack>
        </Modal>

        {/* Cancel Modal */}
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
