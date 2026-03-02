import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Stack, Stepper, Button, Group, Title, Text } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { LocationPicker } from '../components/booking/LocationPicker';
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker';
import { PatientForm } from '../components/booking/PatientForm';
import { BookingSummary } from '../components/booking/BookingSummary';
import { faker } from '@faker-js/faker';
import dayjs from 'dayjs';
import { getAvailableSlotsRequest, listLocationsRequest } from '../api/locations';
import { createAppointmentRequest } from '../api/appointments';
const patientSchema = z.object({
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    hasInsurance: z.enum(['yes', 'no']),
    lastDentalVisit: z.enum(['within-6-months', '6-12-months', 'over-a-year', 'never']),
    hasDentalPain: z.enum(['yes', 'no']),
    allergies: z.string().optional(),
    additionalNotes: z.string().optional(),
});
export const BookingFlow = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState();
    const [slots, setSlots] = useState([]);
    const [isSlotsLoading, setIsSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const form = useForm({
        resolver: zodResolver(patientSchema),
        mode: 'onChange',
        defaultValues: {
            dateOfBirth: '',
            hasInsurance: 'no',
            lastDentalVisit: 'never',
            hasDentalPain: 'no',
            allergies: '',
            additionalNotes: '',
        },
    });
    useEffect(() => {
        const loadLocations = async () => {
            const data = await listLocationsRequest();
            setLocations(data.map((loc) => ({
                id: loc.id,
                name: loc.name,
                address: loc.address ?? '',
                city: loc.city ?? '',
                state: loc.state ?? '',
                phone: loc.phone ?? '',
            })));
        };
        void loadLocations();
    }, []);
    useEffect(() => {
        const loadSlots = async () => {
            if (!selectedLocation || !selectedDate) {
                setSlots([]);
                setSlotsError(null);
                return;
            }
            setIsSlotsLoading(true);
            setSlotsError(null);
            try {
                const data = await getAvailableSlotsRequest(selectedLocation, dayjs(selectedDate).format('YYYY-MM-DD'));
                const allSlots = [
                    ...data.slots_by_time.morning,
                    ...data.slots_by_time.afternoon,
                    ...data.slots_by_time.evening,
                ];
                setSlots(allSlots);
            }
            catch (error) {
                setSlotsError('Failed to load available slots');
                setSlots([]);
            }
            finally {
                setIsSlotsLoading(false);
            }
        };
        void loadSlots();
    }, [selectedLocation, selectedDate]);
    const handleDemoFill = () => {
        const today = new Date();
        const minYear = today.getFullYear() - 65;
        const maxYear = today.getFullYear() - 18;
        const randomYear = faker.number.int({ min: minYear, max: maxYear });
        const randomMonth = faker.number.int({ min: 0, max: 11 });
        const randomDay = faker.number.int({ min: 1, max: 28 });
        const dob = new Date(randomYear, randomMonth, randomDay);
        form.setValue('dateOfBirth', dob.toISOString().split('T')[0]);
        form.setValue('hasInsurance', faker.datatype.boolean() ? 'yes' : 'no');
        form.setValue('lastDentalVisit', faker.helpers.arrayElement(['within-6-months', '6-12-months', 'over-a-year', 'never']));
        form.setValue('hasDentalPain', faker.datatype.boolean() ? 'yes' : 'no');
        form.setValue('allergies', faker.datatype.boolean() ? faker.lorem.sentence() : '');
        form.setValue('additionalNotes', faker.datatype.boolean() ? faker.lorem.sentence() : '');
    };
    const handleNext = () => {
        if (activeStep === 0 && !selectedLocation)
            return;
        if (activeStep === 1 && (!selectedDate || !selectedTime))
            return;
        if (activeStep === 2) {
            form.handleSubmit(() => {
                setActiveStep((prev) => prev + 1);
            })();
            return;
        }
        setActiveStep((prev) => prev + 1);
    };
    const handleConfirm = async () => {
        if (!selectedLocation || !selectedDate || !selectedTime)
            return;
        setSubmitError(null);
        const start = dayjs(`${dayjs(selectedDate).format('YYYY-MM-DD')} ${selectedTime}`);
        try {
            const created = await createAppointmentRequest({
                location_id: selectedLocation,
                scheduled_start: start.toISOString(),
                notes: form.getValues('additionalNotes'),
            });
            navigate(`/appointments/${created.id}`);
        }
        catch {
            setSubmitError('Could not create appointment. Please try another slot.');
        }
    };
    const locationInfo = useMemo(() => locations.find((location) => location.id === selectedLocation) ?? null, [locations, selectedLocation]);
    const formData = form.watch();
    return (_jsx(Container, { size: "lg", py: "xl", children: _jsxs(Stack, { gap: "lg", children: [_jsx(Title, { order: 1, children: "Book Your Appointment" }), submitError && _jsx(Text, { c: "red", children: submitError }), _jsxs(Stepper, { active: activeStep, onStepClick: setActiveStep, allowNextStepsSelect: false, children: [_jsx(Stepper.Step, { label: "Location", description: "Select a clinic", children: _jsx(LocationPicker, { locations: locations, selectedId: selectedLocation, onSelect: setSelectedLocation }) }), _jsx(Stepper.Step, { label: "Date & Time", description: "Choose a date and time", children: _jsxs(Stack, { gap: "lg", children: [_jsx(DateInput, { label: "Select Date", placeholder: "Pick a date", minDate: new Date(), maxDate: dayjs().add(30, 'days').toDate(), value: selectedDate, onChange: setSelectedDate }), selectedDate && (_jsx(TimeSlotPicker, { selectedTime: selectedTime, onSelect: setSelectedTime, slots: slots, isLoading: isSlotsLoading }))] }) }), _jsx(Stepper.Step, { label: "Patient Info", description: "Your medical info", children: _jsx(PatientForm, { form: form, onDemoFill: handleDemoFill }) }), _jsx(Stepper.Step, { label: "Review", description: "Confirm booking", children: locationInfo && selectedDate && selectedTime && (_jsx(BookingSummary, { locationName: locationInfo.name, locationAddress: `${locationInfo.address}, ${locationInfo.city}, ${locationInfo.state}`, date: selectedDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }), time: selectedTime, patientInfo: formData, onEdit: setActiveStep })) })] }), _jsxs(Group, { justify: "space-between", mt: "xl", children: [_jsx(Button, { variant: "light", onClick: () => setActiveStep((prev) => prev - 1), disabled: activeStep === 0, children: "Back" }), activeStep < 3 ? (_jsx(Button, { onClick: handleNext, children: "Next" })) : (_jsx(Button, { onClick: handleConfirm, color: "green", children: "Confirm Booking" }))] })] }) }));
};
