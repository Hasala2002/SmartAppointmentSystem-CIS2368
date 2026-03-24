import { Card, Group, Text, Badge, Anchor, Stack } from '@mantine/core'
import { Link as RouterLink } from 'react-router-dom'
import { Appointment } from '../../types'
import { MdCalendarToday, MdAccessTime, MdLocationOn } from 'react-icons/md'
import { CheckInButton } from '../CheckInButton'
import dayjs from 'dayjs'

interface AppointmentCardProps {
  appointment: Appointment
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'yellow',
  confirmed: 'green',
  checked_in: 'cyan',
  in_progress: 'teal',
  completed: 'blue',
  cancelled: 'red',
  no_show: 'gray',
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  // Check if appointment is today using the scheduledStart ISO string
  const isToday = appointment.scheduledStart && dayjs(appointment.scheduledStart).isSame(dayjs(), 'day')
  
  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4}>
            <Group gap="xs">
              <MdCalendarToday style={{ fontSize: 18, color: 'teal' }} />
              <Text fw={600}>{appointment.date}</Text>
            </Group>
            <Group gap="xs">
              <MdAccessTime style={{ fontSize: 18, color: 'teal' }} />
              <Text size="sm">{appointment.time}</Text>
            </Group>
          </Stack>
          <Badge color={STATUS_COLORS[appointment.status]}>{appointment.status}</Badge>
        </Group>

        <Group gap="xs">
          <MdLocationOn style={{ fontSize: 18, color: 'teal' }} />
          <Text size="sm" c="dimmed">
            {appointment.locationName || appointment.locationId}
          </Text>
        </Group>

        <Anchor component={RouterLink} to={`/appointments/${appointment.id}`} size="sm">
          View Details →
        </Anchor>

        {/* Check-in button for confirmed appointments today */}
        {appointment.status === 'confirmed' && isToday && (
          <CheckInButton
            appointmentId={appointment.id}
            appointmentTime={appointment.time}
          />
        )}
      </Stack>
    </Card>
  )
}
