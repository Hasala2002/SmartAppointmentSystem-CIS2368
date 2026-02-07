import { Container, Stack, Stepper, Button, Group, Title } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { LocationPicker } from '../components/booking/LocationPicker'
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker'
import { PatientForm } from '../components/booking/PatientForm'
import { BookingSummary } from '../components/booking/BookingSummary'
import { PatientInfo } from '../types'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

const patientSchema = z.object({
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  hasInsurance: z.enum(['yes', 'no']),
  lastDentalVisit: z.enum(['within-6-months', '6-12-months', 'over-a-year', 'never']),
  hasDentalPain: z.enum(['yes', 'no']),
  allergies: z.string().optional(),
  additionalNotes: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

const LOCATION_NAMES = {
  '1': { name: 'Houston - Downtown', address: '123 Main St, Houston, TX 77002' },
  '2': { name: 'Houston - Galleria', address: '456 Westheimer Rd, Houston, TX 77056' },
  '3': { name: 'Austin - Central', address: '789 Congress Ave, Austin, TX 78701' },
  '4': { name: 'Austin - Round Rock', address: '321 Palm Valley Blvd, Round Rock, TX 78664' },
  '5': { name: 'Dallas - Uptown', address: '555 McKinney Ave, Dallas, TX 75201' },
  '6': { name: 'Fort Worth - Sundance', address: '888 Sundance Square, Fort Worth, TX 76102' },
}

export const BookingFlow = () => {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedLocation, setSelectedLocation] = useState<string>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>()

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
  })

  const handleDemoFill = () => {
    // Generate a random date of birth (18-65 years old)
    const today = new Date()
    const minYear = today.getFullYear() - 65
    const maxYear = today.getFullYear() - 18
    const randomYear = faker.number.int({ min: minYear, max: maxYear })
    const randomMonth = faker.number.int({ min: 0, max: 11 })
    const randomDay = faker.number.int({ min: 1, max: 28 })
    const dob = new Date(randomYear, randomMonth, randomDay)
    form.setValue('dateOfBirth', dob.toISOString().split('T')[0])
    form.setValue('hasInsurance', faker.datatype.boolean() ? 'yes' : 'no')
    form.setValue(
      'lastDentalVisit',
      faker.helpers.arrayElement(['within-6-months', '6-12-months', 'over-a-year', 'never']) as any
    )
    form.setValue('hasDentalPain', faker.datatype.boolean() ? 'yes' : 'no')
    form.setValue('allergies', faker.datatype.boolean() ? faker.lorem.sentence() : '')
    form.setValue('additionalNotes', faker.datatype.boolean() ? faker.lorem.sentence() : '')
  }

  const handleNext = () => {
    if (activeStep === 0 && !selectedLocation) return
    if (activeStep === 1 && (!selectedDate || !selectedTime)) return
    if (activeStep === 2) {
      form.handleSubmit(() => {
        setActiveStep((prev) => prev + 1)
      })()
      return
    }
    setActiveStep((prev) => prev + 1)
  }

  const handleConfirm = () => {
    if (selectedLocation && selectedDate && selectedTime) {
      const appointmentId = Math.random().toString().slice(2, 8)
      navigate(`/appointments/${appointmentId}`)
    }
  }

  const locationInfo = selectedLocation ? LOCATION_NAMES[selectedLocation as keyof typeof LOCATION_NAMES] : null
  const formData = form.watch()

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>Book Your Appointment</Title>

        <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
          {/* Step 1: Location */}
          <Stepper.Step label="Location" description="Select a clinic">
            <LocationPicker selectedId={selectedLocation} onSelect={setSelectedLocation} />
          </Stepper.Step>

          {/* Step 2: Date & Time */}
          <Stepper.Step label="Date & Time" description="Choose a date and time">
            <Stack gap="lg">
              <DateInput
                label="Select Date"
                placeholder="Pick a date"
                minDate={new Date()}
                maxDate={dayjs().add(30, 'days').toDate()}
                value={selectedDate}
                onChange={setSelectedDate}
              />
              {selectedDate && (
                <TimeSlotPicker selectedTime={selectedTime} onSelect={setSelectedTime} date={selectedDate} />
              )}
            </Stack>
          </Stepper.Step>

          {/* Step 3: Patient Information */}
          <Stepper.Step label="Patient Info" description="Your medical info">
            <PatientForm form={form} onDemoFill={handleDemoFill} />
          </Stepper.Step>

          {/* Step 4: Review */}
          <Stepper.Step label="Review" description="Confirm booking">
            {locationInfo && selectedDate && selectedTime && (
              <BookingSummary
                locationName={locationInfo.name}
                locationAddress={locationInfo.address}
                date={selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                time={selectedTime}
                patientInfo={formData as PatientInfo}
                onEdit={setActiveStep}
              />
            )}
          </Stepper.Step>
        </Stepper>

        {/* Navigation Buttons */}
        <Group justify="space-between" mt="xl">
          <Button
            variant="light"
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0}
          >
            Back
          </Button>

          {activeStep < 3 ? (
            <Button onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button onClick={handleConfirm} color="green">
              Confirm Booking
            </Button>
          )}
        </Group>
      </Stack>
    </Container>
  )
}
