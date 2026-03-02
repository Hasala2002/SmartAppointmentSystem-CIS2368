import dayjs from 'dayjs';
import { apiClient } from './client';
export const mapApiAppointment = (appt, patientInfo) => ({
    id: appt.id,
    userId: appt.customer_id,
    locationId: appt.location_id,
    date: dayjs(appt.scheduled_start).format('MMM DD, YYYY'),
    time: dayjs(appt.scheduled_start).format('h:mm A'),
    status: appt.status,
    patientInfo,
    notes: appt.notes ?? '',
    scheduledStart: appt.scheduled_start,
    scheduledEnd: appt.scheduled_end,
});
export const listAppointmentsRequest = async () => {
    const { data } = await apiClient.get('/appointments/');
    return data;
};
export const getAppointmentRequest = async (id) => {
    const { data } = await apiClient.get(`/appointments/${id}`);
    return data;
};
export const createAppointmentRequest = async (payload) => {
    const { data } = await apiClient.post('/appointments/', payload);
    return data;
};
export const rescheduleAppointmentRequest = async (id, payload) => {
    const { data } = await apiClient.patch(`/appointments/${id}/reschedule`, payload);
    return data;
};
export const cancelAppointmentRequest = async (id, payload) => {
    const { data } = await apiClient.patch(`/appointments/${id}/cancel`, payload);
    return data;
};
