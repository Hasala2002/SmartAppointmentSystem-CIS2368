import { Stack, Paper, Group, TextInput, MultiSelect, Button } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { AppointmentsTable } from '../components/appointments/AppointmentsTable'
import { AppointmentModal } from '../components/appointments/AppointmentModal'
import { mockAppointments } from '../data/mockData'
import { Appointment, AppointmentStatus } from '../types'
import { Search, Download } from 'react-ionicons'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'checked_in', label: 'Checked In' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' }
]

export function Appointments() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState<AppointmentStatus[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [modalOpened, setModalOpened] = useState(false)

  // Filter appointments
  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(apt.status)

    return matchesSearch && matchesStatus
  })

  const handleRowClick = (id: string) => {
    const appointment = mockAppointments.find((apt) => apt.id === id)
    setSelectedAppointment(appointment || null)
    setModalOpened(true)
  }

  const handleViewDetails = (id: string) => {
    setModalOpened(false)
    navigate(`/appointments/${id}`)
  }

  const handleExport = () => {
    // Placeholder for export functionality
    console.log('Exporting appointments...')
  }

  return (
    <Stack gap="lg">
      <PageHeader
        title="Appointments"
        actions={
          <Button leftSection={<Download size="16px" />} variant="light" onClick={handleExport}>
            Export
          </Button>
        }
      />

      {/* Filters */}
      <Paper p="md" radius="md" withBorder>
        <Stack gap="md">
          <TextInput
            placeholder="Search by patient name or email..."
            leftSection={<Search size="16px" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
          />

          <MultiSelect
            label="Filter by Status"
            placeholder="All Statuses"
            data={STATUS_OPTIONS}
            value={selectedStatuses}
            onChange={(values) => setSelectedStatuses(values as AppointmentStatus[])}
            searchable
            clearable
          />
        </Stack>
      </Paper>

      {/* Appointments Table */}
      <Paper p="md" radius="md" withBorder>
        <AppointmentsTable appointments={filteredAppointments} onRowClick={handleRowClick} showLocation />
      </Paper>

      {/* Appointment Modal */}
      <AppointmentModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        appointment={selectedAppointment}
        onViewDetails={handleViewDetails}
      />
    </Stack>
  )
}
