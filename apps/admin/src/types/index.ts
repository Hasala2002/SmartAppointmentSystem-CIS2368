export interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  locationId: string
  locationName: string
  scheduledStart: string
  scheduledEnd: string
  status: AppointmentStatus
  notes?: string
  createdAt: string
  formResponses: PatientFormResponses
}

export type AppointmentStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'checked_in' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'no_show'

export interface PatientFormResponses {
  dateOfBirth: string
  hasInsurance: string
  lastVisit: string
  hasPain: string
  allergies: string
  additionalNotes: string
}

export interface Location {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
}

export const LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Houston - Downtown',
    address: '123 Main St',
    city: 'Houston',
    state: 'TX',
    zip: '77001',
    phone: '(713) 555-1234'
  },
  {
    id: '2',
    name: 'Houston - Midtown',
    address: '456 Washington Ave',
    city: 'Houston',
    state: 'TX',
    zip: '77002',
    phone: '(713) 555-1235'
  },
  {
    id: '3',
    name: 'Houston - West',
    address: '789 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    zip: '77006',
    phone: '(713) 555-1236'
  },
  {
    id: '4',
    name: 'Houston - Heights',
    address: '321 Yale St',
    city: 'Houston',
    state: 'TX',
    zip: '77007',
    phone: '(713) 555-1237'
  },
  {
    id: '5',
    name: 'Houston - Galleria',
    address: '654 Westlake Dr',
    city: 'Houston',
    state: 'TX',
    zip: '77079',
    phone: '(713) 555-1238'
  },
  {
    id: '6',
    name: 'Houston - Pearland',
    address: '987 Peach St',
    city: 'Pearland',
    state: 'TX',
    zip: '77581',
    phone: '(713) 555-1239'
  }
]
