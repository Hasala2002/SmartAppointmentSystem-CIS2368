import {
  Stack,
  Paper,
  Group,
  Button,
  Grid,
  Text,
  Title,
  Divider,
  Badge,
  Timeline,
  ThemeIcon
} from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { mockAppointments } from '../data/mockData'
import { StatusBadge } from '../components/appointments/StatusBadge'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import dayjs from 'dayjs'
import { ArrowBack, Checkmark, Close } from 'react-ionicons'

export function AppointmentDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const appointment = mockAppointments.find((apt) => apt.id === id)

  if (!appointment) {
    return (
      <Stack>
        <Button leftSection={<ArrowBack size="16px" />} variant="subtle" onClick={() => navigate('/appointments')}>
          Back to Appointments
        </Button>
        <EmptyState
          icon={<Close color="currentColor" />}
          title="Appointment Not Found"
          description="The appointment you're looking for doesn't exist."
          action={{
            label: 'View All Appointments',
            onClick: () => navigate('/appointments')
          }}
        />
      </Stack>
    )
  }

  const date = dayjs(appointment.scheduledStart).format('MMMM D, YYYY')
  const startTime = dayjs(appointment.scheduledStart).format('h:mm A')
  const endTime = dayjs(appointment.scheduledEnd).format('h:mm A')
  const duration = dayjs(appointment.scheduledEnd).diff(dayjs(appointment.scheduledStart), 'minute')

  // Mock timeline data
  const timeline = [
    {
      title: 'Appointment Created',
      description: `Created on ${dayjs(appointment.createdAt).format('MMM D, YYYY')}`,
      timestamp: appointment.createdAt
    },
    {
      title: 'Appointment Scheduled',
      description: `Scheduled for ${date}`,
      timestamp: appointment.scheduledStart
    },
    ...(appointment.status !== 'pending'
      ? [
          {
            title: 'Status Updated',
            description: `Status changed to ${appointment.status}`,
            timestamp: dayjs().toISOString()
          }
        ]
      : [])
  ]

  return (
    <Stack gap="lg">
      {/* Back Button & Header */}
      <Group gap="md">
        <Button leftSection={<ArrowBack size="16px" />} variant="subtle" onClick={() => navigate('/appointments')}>
          Back to Appointments
        </Button>
      </Group>

      {/* Title Section */}
      <Group justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Title order={2}>{appointment.patientName}</Title>
          <Text size="sm" c="dimmed">
            Appointment ID: {appointment.id}
          </Text>
        </Stack>
        <StatusBadge status={appointment.status} />
      </Group>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {/* Appointment Info */}
          <Paper p="md" radius="md" withBorder mb="md">
            <Title order={4} mb="md">
              Appointment Information
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Date
                </Text>
                <Text size="sm" fw={500}>
                  {date}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Time
                </Text>
                <Text size="sm" fw={500}>
                  {startTime} - {endTime}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Duration
                </Text>
                <Text size="sm" fw={500}>
                  {duration} minutes
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Location
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.locationName}
                </Text>
              </Group>
            </Stack>
          </Paper>

          {/* Patient Info */}
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Patient Information
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Email
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.patientEmail}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Phone
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.patientPhone}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Date of Birth
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.formResponses.dateOfBirth}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {/* Form Responses */}
          <Paper p="md" radius="md" withBorder mb="md">
            <Title order={4} mb="md">
              Pre-Appointment Form
            </Title>
            <Stack gap="xs">
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Insurance
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.formResponses.hasInsurance}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Last Visit
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.formResponses.lastVisit}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Current Pain
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.formResponses.hasPain}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Allergies
                </Text>
                <Text size="sm" fw={500}>
                  {appointment.formResponses.allergies}
                </Text>
              </Group>
              {appointment.formResponses.additionalNotes && (
                <>
                  <Divider />
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed">
                      Additional Notes
                    </Text>
                    <Text size="sm">{appointment.formResponses.additionalNotes}</Text>
                  </Stack>
                </>
              )}
            </Stack>
          </Paper>

          {/* Timeline */}
          <Paper p="md" radius="md" withBorder>
            <Title order={4} mb="md">
              Timeline
            </Title>
            <Timeline active={timeline.length} bulletSize={24} lineWidth={2}>
              {timeline.map((event, idx) => (
            <Timeline.Item bullet={<Checkmark size="12px" />} key={idx}>
                  <Text fw={500} size="sm">
                    {event.title}
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    {event.description}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Action Buttons */}
      <Group>
        <Button onClick={() => console.log('Check In clicked')}>
          Check In
        </Button>
        <Button onClick={() => console.log('Start Service clicked')}>
          Start Service
        </Button>
        <Button onClick={() => console.log('Complete clicked')}>
          Complete
        </Button>
        <Button onClick={() => console.log('Mark No-Show clicked')} variant="light">
          Mark No-Show
        </Button>
        <Button onClick={() => console.log('Cancel clicked')} color="red" variant="light">
          Cancel
        </Button>
      </Group>
    </Stack>
  )
}
