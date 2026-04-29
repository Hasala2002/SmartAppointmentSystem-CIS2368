export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
}
export interface ApiUser {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    phone: string | null;
    role: string;
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
}
export interface ApiAuthResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: ApiUser;
}
export interface Location {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
}
export interface ApiLocation {
    id: string;
    name: string;
    slug: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    phone: string | null;
    timezone: string;
    appointment_duration_mins: number;
    buffer_mins: number;
    is_active: boolean;
}
export interface Appointment {
    id: string;
    userId: string;
    locationId: string;
    locationName: string | null;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    patientInfo: PatientInfo;
    notes?: string;
    scheduledStart?: string;
    scheduledEnd?: string;
}
export interface ApiAppointment {
    id: string;
    location_id: string;
    location_name: string | null;
    customer_id: string;
    scheduled_start: string;
    scheduled_end: string;
    status: 'pending' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
    notes: string | null;
    confirmation_token: string | null;
    created_at: string;
    updated_at: string;
}
export interface PatientInfo {
    dentalInsuranceStatus: 'same_as_last' | 'changed' | 'no_insurance';
    lastDentalVisit: 'within-6-months' | '6-12-months' | 'over-a-year' | 'never';
    hasDentalPain: boolean;
    allergies?: string;
    additionalNotes?: string;
}
export interface ApiTimeSlot {
    start: string;
    end: string;
    available: boolean;
}
export interface ApiSlotsByTimeOfDay {
    morning: ApiTimeSlot[];
    afternoon: ApiTimeSlot[];
    evening: ApiTimeSlot[];
}
export interface ApiAvailableSlotsResponse {
    location_id: string;
    date: string;
    slots_by_time: ApiSlotsByTimeOfDay;
}
