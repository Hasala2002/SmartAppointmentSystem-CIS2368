import { Table, Group, Pagination, Stack, Center, Text } from '@mantine/core'
import { useState } from 'react'
import { Appointment } from '../../types'
import { AppointmentRow } from './AppointmentRow'
import { Search } from 'react-ionicons'

interface AppointmentsTableProps {
  appointments: Appointment[]
  onRowClick: (id: string) => void
  showLocation?: boolean
}

const ITEMS_PER_PAGE = 10

export function AppointmentsTable({ appointments, onRowClick, showLocation }: AppointmentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const endIdx = startIdx + ITEMS_PER_PAGE
  const pageData = appointments.slice(startIdx, endIdx)
  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE)

  if (appointments.length === 0) {
    return (
      <Center style={{ minHeight: 300 }}>
        <Stack align="center">
          <Search size={48} color="var(--mantine-color-gray-5)" />
          <Text c="dimmed">No appointments found</Text>
        </Stack>
      </Center>
    )
  }

  return (
    <Stack gap="md">
      <div style={{ overflowX: 'auto' }}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Time</Table.Th>
              <Table.Th>Patient</Table.Th>
              {showLocation && <Table.Th>Location</Table.Th>}
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {pageData.map((appointment) => (
              <AppointmentRow
                key={appointment.id}
                appointment={appointment}
                onClick={onRowClick}
                showLocation={showLocation}
              />
            ))}
          </Table.Tbody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Group justify="center">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}
    </Stack>
  )
}
