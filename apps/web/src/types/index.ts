export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
}

export interface Appointment {
  id: string
  userId: string
  locationId: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled'
  patientInfo: PatientInfo
}

export interface PatientInfo {
  dateOfBirth: string
  hasInsurance: 'yes' | 'no'
  lastDentalVisit: 'within-6-months' | '6-12-months' | 'over-a-year' | 'never'
  hasDentalPain: 'yes' | 'no'
  allergies?: string
  additionalNotes?: string
}
