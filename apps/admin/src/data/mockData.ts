import { Appointment } from '../types'
import dayjs from 'dayjs'

const today = dayjs()

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientEmail: 'john.smith@email.com',
    patientPhone: '(713) 555-0101',
    locationId: '1',
    locationName: 'Houston - Downtown',
    scheduledStart: today.hour(9).minute(0).second(0).toISOString(),
    scheduledEnd: today.hour(9).minute(30).second(0).toISOString(),
    status: 'confirmed',
    notes: 'First time patient',
    createdAt: today.subtract(6, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1985-03-15',
      hasInsurance: 'Yes',
      lastVisit: 'Over a year',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Prefer morning appointments'
    }
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    patientEmail: 'sarah.j@email.com',
    patientPhone: '(713) 555-0102',
    locationId: '2',
    locationName: 'Houston - Midtown',
    scheduledStart: today.hour(10).minute(0).second(0).toISOString(),
    scheduledEnd: today.hour(10).minute(30).second(0).toISOString(),
    status: 'checked_in',
    notes: '',
    createdAt: today.subtract(5, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1992-07-22',
      hasInsurance: 'Yes',
      lastVisit: '6 months ago',
      hasPain: 'Slight discomfort',
      allergies: 'Penicillin',
      additionalNotes: ''
    }
  },
  {
    id: '3',
    patientName: 'Michael Chen',
    patientEmail: 'mchen@email.com',
    patientPhone: '(713) 555-0103',
    locationId: '1',
    locationName: 'Houston - Downtown',
    scheduledStart: today.hour(11).minute(30).second(0).toISOString(),
    scheduledEnd: today.hour(12).minute(0).second(0).toISOString(),
    status: 'in_progress',
    notes: 'Routine checkup',
    createdAt: today.subtract(7, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1978-11-08',
      hasInsurance: 'Yes',
      lastVisit: '1 year ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Schedule follow-up cleaning'
    }
  },
  {
    id: '4',
    patientName: 'Emily Rodriguez',
    patientEmail: 'emily.r@email.com',
    patientPhone: '(713) 555-0104',
    locationId: '3',
    locationName: 'Houston - West',
    scheduledStart: today.hour(14).minute(0).second(0).toISOString(),
    scheduledEnd: today.hour(14).minute(30).second(0).toISOString(),
    status: 'pending',
    notes: '',
    createdAt: today.toISOString(),
    formResponses: {
      dateOfBirth: '1995-05-12',
      hasInsurance: 'No',
      lastVisit: 'Never',
      hasPain: 'Yes',
      allergies: 'None',
      additionalNotes: 'New patient, lower right molar pain'
    }
  },
  {
    id: '5',
    patientName: 'David Williams',
    patientEmail: 'david.w@email.com',
    patientPhone: '(713) 555-0105',
    locationId: '4',
    locationName: 'Houston - Heights',
    scheduledStart: today.hour(15).minute(0).second(0).toISOString(),
    scheduledEnd: today.hour(15).minute(30).second(0).toISOString(),
    status: 'completed',
    notes: 'Cleaning completed successfully',
    createdAt: today.subtract(2, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1988-09-20',
      hasInsurance: 'Yes',
      lastVisit: '3 months ago',
      hasPain: 'No',
      allergies: 'Latex',
      additionalNotes: ''
    }
  },
  {
    id: '6',
    patientName: 'Jessica Taylor',
    patientEmail: 'j.taylor@email.com',
    patientPhone: '(713) 555-0106',
    locationId: '2',
    locationName: 'Houston - Midtown',
    scheduledStart: today.hour(16).minute(0).second(0).toISOString(),
    scheduledEnd: today.hour(16).minute(30).second(0).toISOString(),
    status: 'cancelled',
    notes: 'Patient requested cancellation',
    createdAt: today.subtract(3, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1990-01-18',
      hasInsurance: 'Yes',
      lastVisit: '2 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: ''
    }
  },
  {
    id: '7',
    patientName: 'Robert Martinez',
    patientEmail: 'r.martinez@email.com',
    patientPhone: '(713) 555-0107',
    locationId: '5',
    locationName: 'Houston - Galleria',
    scheduledStart: today.add(1, 'day').hour(9).minute(0).second(0).toISOString(),
    scheduledEnd: today.add(1, 'day').hour(9).minute(30).second(0).toISOString(),
    status: 'pending',
    notes: '',
    createdAt: today.toISOString(),
    formResponses: {
      dateOfBirth: '1982-04-25',
      hasInsurance: 'Yes',
      lastVisit: '1 year ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: ''
    }
  },
  {
    id: '8',
    patientName: 'Amanda Brown',
    patientEmail: 'amanda.b@email.com',
    patientPhone: '(713) 555-0108',
    locationId: '1',
    locationName: 'Houston - Downtown',
    scheduledStart: today.add(1, 'day').hour(10).minute(30).second(0).toISOString(),
    scheduledEnd: today.add(1, 'day').hour(11).minute(0).second(0).toISOString(),
    status: 'confirmed',
    notes: 'Crown consultation',
    createdAt: today.subtract(1, 'day').toISOString(),
    formResponses: {
      dateOfBirth: '1987-06-14',
      hasInsurance: 'Yes',
      lastVisit: '6 months ago',
      hasPain: 'Mild sensitivity',
      allergies: 'None',
      additionalNotes: 'Discussing crown on #14'
    }
  },
  {
    id: '9',
    patientName: 'James Anderson',
    patientEmail: 'j.anderson@email.com',
    patientPhone: '(713) 555-0109',
    locationId: '6',
    locationName: 'Houston - Pearland',
    scheduledStart: today.add(1, 'day').hour(13).minute(0).second(0).toISOString(),
    scheduledEnd: today.add(1, 'day').hour(13).minute(30).second(0).toISOString(),
    status: 'confirmed',
    notes: '',
    createdAt: today.subtract(4, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1975-12-03',
      hasInsurance: 'Yes',
      lastVisit: '8 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Annual exam'
    }
  },
  {
    id: '10',
    patientName: 'Lisa Garcia',
    patientEmail: 'l.garcia@email.com',
    patientPhone: '(713) 555-0110',
    locationId: '3',
    locationName: 'Houston - West',
    scheduledStart: today.add(2, 'days').hour(11).minute(0).second(0).toISOString(),
    scheduledEnd: today.add(2, 'days').hour(11).minute(30).second(0).toISOString(),
    status: 'confirmed',
    notes: 'Whitening treatment',
    createdAt: today.subtract(5, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1993-08-30',
      hasInsurance: 'Yes',
      lastVisit: '3 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Cosmetic whitening appointment'
    }
  },
  {
    id: '11',
    patientName: 'Christopher Lee',
    patientEmail: 'c.lee@email.com',
    patientPhone: '(713) 555-0111',
    locationId: '4',
    locationName: 'Houston - Heights',
    scheduledStart: today.subtract(1, 'day').hour(10).minute(0).second(0).toISOString(),
    scheduledEnd: today.subtract(1, 'day').hour(10).minute(30).second(0).toISOString(),
    status: 'completed',
    notes: 'Root canal treatment completed',
    createdAt: today.subtract(8, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1980-02-17',
      hasInsurance: 'Yes',
      lastVisit: '4 months ago',
      hasPain: 'Had severe pain, now resolved',
      allergies: 'None',
      additionalNotes: 'Follow-up in 2 weeks'
    }
  },
  {
    id: '12',
    patientName: 'Patricia White',
    patientEmail: 'p.white@email.com',
    patientPhone: '(713) 555-0112',
    locationId: '2',
    locationName: 'Houston - Midtown',
    scheduledStart: today.subtract(2, 'days').hour(14).minute(0).second(0).toISOString(),
    scheduledEnd: today.subtract(2, 'days').hour(14).minute(30).second(0).toISOString(),
    status: 'no_show',
    notes: 'Patient did not arrive for appointment',
    createdAt: today.subtract(9, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1965-11-05',
      hasInsurance: 'Yes',
      lastVisit: '1 year ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: ''
    }
  },
  {
    id: '13',
    patientName: 'Thomas Davis',
    patientEmail: 't.davis@email.com',
    patientPhone: '(713) 555-0113',
    locationId: '5',
    locationName: 'Houston - Galleria',
    scheduledStart: today.subtract(3, 'days').hour(9).minute(30).second(0).toISOString(),
    scheduledEnd: today.subtract(3, 'days').hour(10).minute(0).second(0).toISOString(),
    status: 'completed',
    notes: 'Filling replacement',
    createdAt: today.subtract(10, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1971-07-22',
      hasInsurance: 'Yes',
      lastVisit: '2 years ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Old filling replaced with resin'
    }
  },
  {
    id: '14',
    patientName: 'Jennifer Moore',
    patientEmail: 'j.moore@email.com',
    patientPhone: '(713) 555-0114',
    locationId: '1',
    locationName: 'Houston - Downtown',
    scheduledStart: today.subtract(4, 'days').hour(15).minute(0).second(0).toISOString(),
    scheduledEnd: today.subtract(4, 'days').hour(15).minute(30).second(0).toISOString(),
    status: 'completed',
    notes: 'Cleaning and exam',
    createdAt: today.subtract(11, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1989-03-19',
      hasInsurance: 'Yes',
      lastVisit: '6 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Requested more frequent cleanings'
    }
  },
  {
    id: '15',
    patientName: 'Mark Jackson',
    patientEmail: 'm.jackson@email.com',
    patientPhone: '(713) 555-0115',
    locationId: '6',
    locationName: 'Houston - Pearland',
    scheduledStart: today.subtract(5, 'days').hour(11).minute(0).second(0).toISOString(),
    scheduledEnd: today.subtract(5, 'days').hour(11).minute(30).second(0).toISOString(),
    status: 'completed',
    notes: 'Orthodontic consultation',
    createdAt: today.subtract(12, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1999-05-27',
      hasInsurance: 'Yes',
      lastVisit: 'First visit',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Considering braces'
    }
  },
  {
    id: '16',
    patientName: 'Susan Harris',
    patientEmail: 's.harris@email.com',
    patientPhone: '(713) 555-0116',
    locationId: '3',
    locationName: 'Houston - West',
    scheduledStart: today.subtract(6, 'days').hour(13).minute(30).second(0).toISOString(),
    scheduledEnd: today.subtract(6, 'days').hour(14).minute(0).second(0).toISOString(),
    status: 'completed',
    notes: 'Emergency extraction',
    createdAt: today.subtract(13, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1970-09-12',
      hasInsurance: 'No',
      lastVisit: '2 years ago',
      hasPain: 'Severe pain - emergency',
      allergies: 'Sulfa drugs',
      additionalNotes: 'Discussed denture options'
    }
  },
  {
    id: '17',
    patientName: 'Kevin Wilson',
    patientEmail: 'k.wilson@email.com',
    patientPhone: '(713) 555-0117',
    locationId: '4',
    locationName: 'Houston - Heights',
    scheduledStart: today.subtract(7, 'days').hour(10).minute(30).second(0).toISOString(),
    scheduledEnd: today.subtract(7, 'days').hour(11).minute(0).second(0).toISOString(),
    status: 'completed',
    notes: 'Periodontal therapy session 1',
    createdAt: today.subtract(14, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1977-01-08',
      hasInsurance: 'Yes',
      lastVisit: '1 year ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Gum disease treatment - 4 sessions planned'
    }
  },
  {
    id: '18',
    patientName: 'Nancy Martin',
    patientEmail: 'n.martin@email.com',
    patientPhone: '(713) 555-0118',
    locationId: '2',
    locationName: 'Houston - Midtown',
    scheduledStart: today.subtract(8, 'days').hour(14).minute(0).second(0).toISOString(),
    scheduledEnd: today.subtract(8, 'days').hour(14).minute(30).second(0).toISOString(),
    status: 'completed',
    notes: 'Implant placement',
    createdAt: today.subtract(15, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1966-12-30',
      hasInsurance: 'Yes',
      lastVisit: '8 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Bone graft successful, implant placed'
    }
  },
  {
    id: '19',
    patientName: 'Steven Clark',
    patientEmail: 's.clark@email.com',
    patientPhone: '(713) 555-0119',
    locationId: '5',
    locationName: 'Houston - Galleria',
    scheduledStart: today.add(3, 'days').hour(10).minute(0).second(0).toISOString(),
    scheduledEnd: today.add(3, 'days').hour(10).minute(30).second(0).toISOString(),
    status: 'confirmed',
    notes: 'Bridge adjustment',
    createdAt: today.subtract(2, 'days').toISOString(),
    formResponses: {
      dateOfBirth: '1973-08-16',
      hasInsurance: 'Yes',
      lastVisit: '4 months ago',
      hasPain: 'Slight discomfort with bridge',
      allergies: 'None',
      additionalNotes: 'Adjustment needed on maxillary bridge'
    }
  },
  {
    id: '20',
    patientName: 'Donna Thomas',
    patientEmail: 'd.thomas@email.com',
    patientPhone: '(713) 555-0120',
    locationId: '1',
    locationName: 'Houston - Downtown',
    scheduledStart: today.add(4, 'days').hour(15).minute(0).second(0).toISOString(),
    scheduledEnd: today.add(4, 'days').hour(15).minute(30).second(0).toISOString(),
    status: 'pending',
    notes: 'Follow-up exam',
    createdAt: today.subtract(1, 'day').toISOString(),
    formResponses: {
      dateOfBirth: '1981-10-11',
      hasInsurance: 'Yes',
      lastVisit: '2 months ago',
      hasPain: 'No',
      allergies: 'None',
      additionalNotes: 'Post-treatment follow-up'
    }
  }
]
