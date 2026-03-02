import dayjs from 'dayjs'
import { apiClient } from './client'
import { Appointment, AppointmentStatus, LOCATIONS } from '../types'

interface ApiAppointment {
  id: string
  location_id: string
  scheduled_start: string
  scheduled_end: string
  status: AppointmentStatus
  notes: string | null
  created_at: string
}

const locationById = new Map(LOCATIONS.map((loc) => [loc.id, loc]))

const mapApiAppointment = (appt: ApiAppointment): Appointment => {
  const location = locationById.get(appt.location_id)
  return {
    id: appt.id,
    patientName: 'Current User',
    patientEmail: 'self@account.local',
    patientPhone: 'N/A',
    locationId: appt.location_id,
    locationName: location?.name ?? appt.location_id,
    scheduledStart: appt.scheduled_start,
    scheduledEnd: appt.scheduled_end,
    status: appt.status,
    notes: appt.notes ?? '',
    createdAt: appt.created_at,
    formResponses: {
      dateOfBirth: 'N/A',
      hasInsurance: 'N/A',
      lastVisit: 'N/A',
      hasPain: 'N/A',
      allergies: 'N/A',
      additionalNotes: '',
    },
  }
}

export const listAppointmentsRequest = async (): Promise<Appointment[]> => {
  const { data } = await apiClient.get<ApiAppointment[]>('/appointments/')
  return data
    .map(mapApiAppointment)
    .sort((a, b) => dayjs(a.scheduledStart).valueOf() - dayjs(b.scheduledStart).valueOf())
}

export const getAppointmentRequest = async (id: string): Promise<Appointment> => {
  const { data } = await apiClient.get<ApiAppointment>(`/appointments/${id}`)
  return mapApiAppointment(data)
}
