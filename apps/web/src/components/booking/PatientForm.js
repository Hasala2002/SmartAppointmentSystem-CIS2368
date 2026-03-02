import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack, Text, Group, Button, Select, Radio, Textarea } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import dayjs from 'dayjs';
export const PatientForm = ({ form, onDemoFill }) => {
    const insurance = form.watch('hasInsurance');
    const lastDentalVisit = form.watch('lastDentalVisit');
    const hasDentalPain = form.watch('hasDentalPain');
    return (_jsxs(Stack, { gap: "lg", children: [_jsxs(Group, { justify: "space-between", children: [_jsx(Text, { fw: 600, size: "lg", children: "Pre-Appointment Information" }), _jsx(Button, { variant: "light", size: "xs", onClick: onDemoFill, children: "Fill with Demo Data" })] }), _jsx(DateInput, { label: "Date of Birth", placeholder: "Select your date of birth", maxDate: new Date(), value: form.watch('dateOfBirth') ? dayjs(form.watch('dateOfBirth')).toDate() : null, onChange: (date) => form.setValue('dateOfBirth', date ? dayjs(date).format('YYYY-MM-DD') : '') }), _jsx(Select, { label: "Do you have dental insurance?", placeholder: "Select an option", data: [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                ], value: insurance, onChange: (value) => form.setValue('hasInsurance', value ?? 'no') }), _jsx(Select, { label: "When was your last dental visit?", placeholder: "Select a timeframe", data: [
                    { value: 'within-6-months', label: 'Within 6 months' },
                    { value: '6-12-months', label: '6-12 months' },
                    { value: 'over-a-year', label: 'Over a year' },
                    { value: 'never', label: 'Never' },
                ], value: lastDentalVisit, onChange: (value) => form.setValue('lastDentalVisit', value ?? 'never') }), _jsx(Radio.Group, { label: "Are you currently experiencing any dental pain?", value: hasDentalPain, onChange: (value) => form.setValue('hasDentalPain', value), children: _jsxs(Stack, { gap: "sm", children: [_jsx(Radio, { value: "yes", label: "Yes" }), _jsx(Radio, { value: "no", label: "No" })] }) }), _jsx(Textarea, { label: "Do you have any allergies to medications? (Optional)", placeholder: "List any medication allergies...", value: form.watch('allergies') ?? '', onChange: (e) => form.setValue('allergies', e.currentTarget.value) }), _jsx(Textarea, { label: "Any additional notes for the dentist? (Optional)", placeholder: "Anything else the dentist should know...", value: form.watch('additionalNotes') ?? '', onChange: (e) => form.setValue('additionalNotes', e.currentTarget.value) })] }));
};
