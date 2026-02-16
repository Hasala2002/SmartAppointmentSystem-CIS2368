import { Table, Group, Text, Stack } from '@mantine/core'
import { Appointment } from '../../types'
import { StatusBadge } from './StatusBadge'
import dayjs from 'dayjs'

interface AppointmentRowProps {
  appointment: Appointment
  onClick: (id: string) => void
  showLocation?: boolean
}

export function AppointmentRow({ appointment, onClick, showLocation }: AppointmentRowProps) {
  const time = dayjs(appointment.scheduledStart).format('h:mm A')

  return (
    <Table.Tr
      onClick={() => onClick(appointment.id)}
      style={{
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'var(--mantine-color-gray-0)'
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-0)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <Table.Td fw={500}>{time}</Table.Td>
      <Table.Td>
        <Stack gap={0}>
          <Text fw={500}>{appointment.patientName}</Text>
          <Text size="xs" c="dimmed">
            {appointment.patientEmail}
          </Text>
        </Stack>
      </Table.Td>
      {showLocation && <Table.Td>{appointment.locationName}</Table.Td>}
      <Table.Td>
        <StatusBadge status={appointment.status} />
      </Table.Td>
    </Table.Tr>
  )
}
