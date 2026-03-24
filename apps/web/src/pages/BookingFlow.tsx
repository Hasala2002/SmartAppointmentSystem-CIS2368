import { Container, Stack, Stepper, Button, Group, Title, Text } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { LocationPicker } from '../components/booking/LocationPicker'
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker'
import { PatientForm } from '../components/booking/PatientForm'
import { BookingSummary } from '../components/booking/BookingSummary'
import { ApiTimeSlot, Location, PatientInfo } from '../types'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { getAvailableSlotsRequest, listLocationsRequest } from '../api/locations'
import { createAppointmentRequest, cancelAppointmentRequest } from '../api/appointments'
import { useAuth } from '../hooks/useAuth'

const patientSchema = z.object({
  dentalInsuranceStatus: z.enum(['same_as_last', 'changed', 'no_insurance']),
  lastDentalVisit: z.enum(['within-6-months', '6-12-months', 'over-a-year', 'never']),
  hasDentalPain: z.boolean(),
  allergies: z.string().optional(),
  additionalNotes: z.string().optional(),
})

type PatientFormData = z.infer<typeof patientSchema>

export const BookingFlow = () => {
  const navigate = useNavigate()
  const locationState = useLocation()
  const rescheduleAppointmentId =
    (locationState.state as { rescheduleAppointmentId?: string } | null)?.rescheduleAppointmentId
  const { user } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [locations, setLocations] = useState<Location[]>([])
  const [isLocationsLoading, setIsLocationsLoading] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>()
  const [slotsByTime, setSlotsByTime] = useState<{ morning: ApiTimeSlot[]; afternoon: ApiTimeSlot[]; evening: ApiTimeSlot[] }>({
    morning: [],
    afternoon: [],
    evening: [],
  })
  const [isSlotsLoading, setIsSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: 'onChange',
    defaultValues: {
      dentalInsuranceStatus: 'same_as_last',
      lastDentalVisit: 'never',
      hasDentalPain: false,
      allergies: '',
      additionalNotes: '',
    },
  })

  useEffect(() => {
    const loadLocations = async () => {
      setIsLocationsLoading(true)
      try {
        const data = await listLocationsRequest()
        setLocations(
          data.map((loc) => ({
            id: loc.id,
            name: loc.name,
            address: loc.address ?? '',
            city: loc.city ?? '',
            state: loc.state ?? '',
            phone: loc.phone ?? '',
          }))
        )
      } finally {
        setIsLocationsLoading(false)
      }
    }
    void loadLocations()
  }, [])

  useEffect(() => {
    const loadSlots = async () => {
      if (!selectedLocation || !selectedDate) {
        setSlotsByTime({ morning: [], afternoon: [], evening: [] })
        setSlotsError(null)
        return
      }
      setIsSlotsLoading(true)
      setSlotsError(null)
      try {
        const data = await getAvailableSlotsRequest(
          selectedLocation,
          dayjs(selectedDate).format('YYYY-MM-DD')
        )
        setSlotsByTime(data.slots_by_time)
      } catch (error) {
        setSlotsError('Failed to load available slots')
        setSlotsByTime({ morning: [], afternoon: [], evening: [] })
      } finally {
        setIsSlotsLoading(false)
      }
    }
    void loadSlots()
  }, [selectedLocation, selectedDate])

  const handleDemoFill = () => {
    form.setValue(
      'dentalInsuranceStatus',
      faker.helpers.arrayElement(['same_as_last', 'changed', 'no_insurance'])
    )
    form.setValue(
      'lastDentalVisit',
      faker.helpers.arrayElement(['within-6-months', '6-12-months', 'over-a-year', 'never'])
    )
    form.setValue('hasDentalPain', faker.datatype.boolean())
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

  const handleConfirm = async () => {
    if (!selectedLocation || !selectedDate || !selectedTime) return
    setSubmitError(null)

    // Build local datetimes (no timezone conversion) to avoid UTC shifting
    const start = dayjs(`${dayjs(selectedDate).format('YYYY-MM-DD')} ${selectedTime}`)
    const end = start.add(15, 'minutes')
    const startLocalIso = start.format('YYYY-MM-DDTHH:mm:ss')
    const endLocalIso = end.format('YYYY-MM-DDTHH:mm:ss')
    const patient = form.getValues()

    try {
      const created = await createAppointmentRequest({
        location_id: selectedLocation,
        scheduled_start: startLocalIso,
        scheduled_end: endLocalIso,
        notes: patient.additionalNotes,
        last_dental_visit: patient.lastDentalVisit,
        has_dental_pain: patient.hasDentalPain,
        allergies: patient.allergies,
        additional_notes: patient.additionalNotes,
      })
      if (rescheduleAppointmentId) {
        // cancel old appointment so it disappears from customer view
        try {
          await cancelAppointmentRequest(rescheduleAppointmentId, { reason: 'Rescheduled' })
        } catch {
          /* ignore */
        }
      }
      navigate(`/appointments/${created.id}`)
    } catch {
      setSubmitError('Could not create appointment. Please try another slot.')
    }
  }

  const locationInfo = useMemo(
    () => locations.find((location) => location.id === selectedLocation) ?? null,
    [locations, selectedLocation]
  )
  const formData = form.watch()

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1}>Book Your Appointment</Title>
        {submitError && <Text c="red">{submitError}</Text>}

        <Stepper active={activeStep} onStepClick={setActiveStep} allowNextStepsSelect={false}>
          <Stepper.Step label="Location" description="Select a clinic">
            <LocationPicker
              locations={locations}
              selectedId={selectedLocation}
              onSelect={setSelectedLocation}
              isLoading={isLocationsLoading}
            />
          </Stepper.Step>

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
                <TimeSlotPicker
                  selectedTime={selectedTime}
                  onSelect={setSelectedTime}
                  slotsByTime={slotsByTime}
                  isLoading={isSlotsLoading}
                  selectedDate={selectedDate}
                />
              )}
            </Stack>
          </Stepper.Step>

          <Stepper.Step label="Patient Info" description="Your medical info">
            <PatientForm form={form} onDemoFill={handleDemoFill} />
          </Stepper.Step>

          <Stepper.Step label="Review" description="Confirm booking">
            {locationInfo && selectedDate && selectedTime && (
              <BookingSummary
                locationName={locationInfo.name}
                locationAddress={`${locationInfo.address}, ${locationInfo.city}, ${locationInfo.state}`}
                date={selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                time={selectedTime}
                patientInfo={formData as PatientInfo}
                patientDob={user?.dateOfBirth ?? null}
                onEdit={setActiveStep}
              />
            )}
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="xl">
          <Button
            variant="light"
            onClick={() => setActiveStep((prev) => prev - 1)}
            disabled={activeStep === 0}
          >
            Back
          </Button>

          {activeStep < 3 ? (
            <Button onClick={handleNext}>Next</Button>
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
