import dayjs from 'dayjs'
import { apiClient } from './client'
import { ApiAppointment, Appointment, PatientInfo } from '../types'

interface CreateAppointmentPayload {
  location_id: string
  scheduled_start: string
  scheduled_end?: string
  notes?: string
  last_dental_visit?: 'within-6-months' | '6-12-months' | 'over-a-year' | 'never'
  has_dental_pain?: boolean
  allergies?: string
  additional_notes?: string
}

interface ReschedulePayload {
  scheduled_start: string
}

interface CancelPayload {
  reason?: string
}

export const mapApiAppointment = (
  appt: ApiAppointment,
  patientInfo: PatientInfo
): Appointment => ({
  id: appt.id,
  userId: appt.customer_id,
  locationId: appt.location_id,
  locationName: appt.location_name,
  date: dayjs(appt.scheduled_start).format('MMM DD, YYYY'),
  time: dayjs(appt.scheduled_start).format('h:mm A'),
  status: appt.status,
  patientInfo,
  notes: appt.notes ?? '',
  scheduledStart: appt.scheduled_start,
  scheduledEnd: appt.scheduled_end,
  lastDentalVisit: appt.last_dental_visit,
  hasDentalPain: appt.has_dental_pain,
  allergies: appt.allergies,
  additionalNotes: appt.additional_notes,
})

export const listAppointmentsRequest = async (): Promise<ApiAppointment[]> => {
  const { data } = await apiClient.get<ApiAppointment[]>('/appointments/')
  return data
}

export const getAppointmentRequest = async (id: string): Promise<ApiAppointment> => {
  const { data } = await apiClient.get<ApiAppointment>(`/appointments/${id}`)
  return data
}

export const createAppointmentRequest = async (
  payload: CreateAppointmentPayload
): Promise<ApiAppointment> => {
  const { data } = await apiClient.post<ApiAppointment>('/appointments/', payload)
  return data
}

export const rescheduleAppointmentRequest = async (
  id: string,
  payload: ReschedulePayload
): Promise<ApiAppointment> => {
  const { data } = await apiClient.patch<ApiAppointment>(
    `/appointments/${id}/reschedule`,
    payload
  )
  return data
}

export const cancelAppointmentRequest = async (
  id: string,
  payload: CancelPayload
): Promise<ApiAppointment> => {
  const { data } = await apiClient.patch<ApiAppointment>(`/appointments/${id}/cancel`, payload)
  return data
}
