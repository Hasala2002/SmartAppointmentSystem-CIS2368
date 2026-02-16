export interface Appointment {
    id: string;
    patientName: string;
    patientEmail: string;
    patientPhone: string;
    locationId: string;
    locationName: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt: string;
    formResponses: PatientFormResponses;
}
export type AppointmentStatus = 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
export interface PatientFormResponses {
    dateOfBirth: string;
    hasInsurance: string;
    lastVisit: string;
    hasPain: string;
    allergies: string;
    additionalNotes: string;
}
export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
}
export declare const LOCATIONS: Location[];
