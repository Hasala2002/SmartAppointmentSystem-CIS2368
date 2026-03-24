import dayjs from 'dayjs'
import { apiClient } from './client'
import { Appointment, AppointmentStatus, LOCATIONS } from '../types'

interface ApiAppointment {
  id: string
  location_id: string
  location_name: string | null
  customer_id: string
  customer_email: string | null
  customer_first_name: string | null
  customer_last_name: string | null
  customer_phone: string | null
  customer_date_of_birth: string | null
  scheduled_start: string
  scheduled_end: string
  status: AppointmentStatus
  notes: string | null
  created_at: string
  last_dental_visit: 'within-6-months' | '6-12-months' | 'over-a-year' | 'never' | null
  has_dental_pain: boolean | null
  allergies: string | null
  additional_notes: string | null
  cancellation_reason: string | null
}

const locationById = new Map(LOCATIONS.map((loc) => [loc.id, loc]))

const mapApiAppointment = (appt: ApiAppointment): Appointment => {
  const location = locationById.get(appt.location_id)
  const patientName = appt.customer_first_name && appt.customer_last_name
    ? `${appt.customer_first_name} ${appt.customer_last_name}`
    : 'Unknown'
  return {
    id: appt.id,
    patientName,
    patientEmail: appt.customer_email ?? 'N/A',
    patientPhone: appt.customer_phone ?? 'N/A',
    patientDob: appt.customer_date_of_birth ?? 'N/A',
    locationId: appt.location_id,
    locationName: appt.location_name ?? location?.name ?? appt.location_id,
    scheduledStart: appt.scheduled_start,
    scheduledEnd: appt.scheduled_end,
    status: appt.status,
    notes: appt.notes ?? '',
    cancellationReason: appt.cancellation_reason ?? '',
    createdAt: appt.created_at,
    formResponses: {
      dateOfBirth: appt.customer_date_of_birth ?? 'N/A',
      hasInsurance: 'N/A', // not included in appointment response
      lastVisit: appt.last_dental_visit ?? 'N/A',
      hasPain: appt.has_dental_pain === null ? 'N/A' : appt.has_dental_pain ? 'Yes' : 'No',
      allergies: appt.allergies ?? 'N/A',
      additionalNotes: appt.additional_notes ?? '',
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
