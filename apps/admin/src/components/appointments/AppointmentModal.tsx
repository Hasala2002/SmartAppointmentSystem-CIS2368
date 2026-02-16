import { Modal, Stack, Group, Text, Button } from '@mantine/core'
import { Appointment } from '../../types'
import { StatusBadge } from './StatusBadge'
import dayjs from 'dayjs'

interface AppointmentModalProps {
  opened: boolean
  onClose: () => void
  appointment: Appointment | null
  onViewDetails?: (id: string) => void
}

export function AppointmentModal({ opened, onClose, appointment, onViewDetails }: AppointmentModalProps) {
  if (!appointment) return null

  const date = dayjs(appointment.scheduledStart).format('MMMM D, YYYY')
  const time = dayjs(appointment.scheduledStart).format('h:mm A')
  const duration = dayjs(appointment.scheduledEnd).diff(dayjs(appointment.scheduledStart), 'minute')

  return (
    <Modal opened={opened} onClose={onClose} title="Appointment Details" size="md">
      <Stack gap="md">
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text fw={600} size="lg">
              {appointment.patientName}
            </Text>
            <Text size="sm" c="dimmed">
              {appointment.patientEmail}
            </Text>
          </Stack>
          <StatusBadge status={appointment.status} />
        </Group>

        <Stack gap="xs">
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Date & Time
            </Text>
            <Text size="sm" fw={500}>
              {date} at {time}
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
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              Phone
            </Text>
            <Text size="sm" fw={500}>
              {appointment.patientPhone}
            </Text>
          </Group>
        </Stack>

        {appointment.notes && (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Notes
            </Text>
            <Text size="sm">{appointment.notes}</Text>
          </Stack>
        )}

        <Group justify="flex-end" mt="lg">
          <Button variant="light" onClick={onClose}>
            Close
          </Button>
          {onViewDetails && (
            <Button onClick={() => onViewDetails(appointment.id)}>
              View Full Details
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  )
}
