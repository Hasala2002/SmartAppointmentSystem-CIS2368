import { Card, Group, Text, Badge, Anchor, Stack } from '@mantine/core'
import { Link as RouterLink } from 'react-router-dom'
import { Appointment } from '../../types'
import { MdCalendarToday, MdAccessTime, MdLocationOn } from 'react-icons/md'

interface AppointmentCardProps {
  appointment: Appointment
}

const STATUS_COLORS = {
  confirmed: 'green',
  pending: 'yellow',
  completed: 'blue',
  cancelled: 'red',
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
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
            Location ID: {appointment.locationId}
          </Text>
        </Group>

        <Anchor component={RouterLink} to={`/appointments/${appointment.id}`} size="sm">
          View Details →
        </Anchor>
      </Stack>
    </Card>
  )
}
