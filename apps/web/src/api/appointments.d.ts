import { ApiAppointment, Appointment, PatientInfo } from '../types';
interface CreateAppointmentPayload {
    location_id: string;
    scheduled_start: string;
    notes?: string;
}
interface ReschedulePayload {
    scheduled_start: string;
}
interface CancelPayload {
    reason?: string;
}
export declare const mapApiAppointment: (appt: ApiAppointment, patientInfo: PatientInfo) => Appointment;
export declare const listAppointmentsRequest: () => Promise<ApiAppointment[]>;
export declare const getAppointmentRequest: (id: string) => Promise<ApiAppointment>;
export declare const createAppointmentRequest: (payload: CreateAppointmentPayload) => Promise<ApiAppointment>;
export declare const rescheduleAppointmentRequest: (id: string, payload: ReschedulePayload) => Promise<ApiAppointment>;
export declare const cancelAppointmentRequest: (id: string, payload: CancelPayload) => Promise<ApiAppointment>;
export {};
