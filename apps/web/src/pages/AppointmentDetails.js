import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Title, Stack, Paper, Group, Badge, Button, Modal, Textarea, Text, } from '@mantine/core';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { MdCalendarToday, MdLocationOn } from 'react-icons/md';
import dayjs from 'dayjs';
import { cancelAppointmentRequest, getAppointmentRequest } from '../api/appointments';
import { listLocationsRequest } from '../api/locations';
const STATUS_COLORS = {
    pending: 'yellow',
    confirmed: 'green',
    checked_in: 'cyan',
    in_progress: 'teal',
    completed: 'blue',
    cancelled: 'red',
    no_show: 'gray',
};
export const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [openedModal, setOpenedModal] = useState(null);
    const [cancelReason, setCancelReason] = useState('');
    const [appointment, setAppointment] = useState(null);
    const [locations, setLocations] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            if (!id)
                return;
            setError(null);
            try {
                const [appt, apiLocations] = await Promise.all([getAppointmentRequest(id), listLocationsRequest()]);
                setAppointment(appt);
                setLocations(apiLocations.map((loc) => ({
                    id: loc.id,
                    name: loc.name,
                    address: loc.address ?? '',
                    city: loc.city ?? '',
                    state: loc.state ?? '',
                    phone: loc.phone ?? '',
                })));
            }
            catch {
                setError('Unable to load appointment details.');
            }
        };
        void loadData();
    }, [id]);
    const location = useMemo(() => locations.find((loc) => loc.id === appointment?.location_id) ?? null, [appointment?.location_id, locations]);
    const handleReschedule = () => {
        setOpenedModal(null);
        navigate('/book');
    };
    const handleCancel = async () => {
        if (!id)
            return;
        try {
            const updated = await cancelAppointmentRequest(id, { reason: cancelReason || undefined });
            setAppointment(updated);
            setOpenedModal(null);
            setCancelReason('');
        }
        catch {
            setError('Unable to cancel appointment.');
        }
    };
    if (error) {
        return (_jsx(Container, { size: "lg", py: "xl", children: _jsx(Text, { c: "red", children: error }) }));
    }
    if (!appointment) {
        return (_jsx(Container, { size: "lg", py: "xl", children: _jsx(Text, { c: "dimmed", children: "Loading appointment..." }) }));
    }
    return (_jsx(Container, { size: "lg", py: "xl", children: _jsxs(Stack, { gap: "lg", children: [_jsx(Button, { variant: "subtle", onClick: () => navigate('/dashboard'), children: "\u2190 Back to Dashboard" }), _jsxs(Paper, { p: "lg", radius: "md", withBorder: true, children: [_jsxs(Group, { justify: "space-between", mb: "md", children: [_jsx(Title, { order: 2, children: "Appointment Details" }), _jsx(Badge, { color: STATUS_COLORS[appointment.status] ?? 'gray', children: appointment.status })] }), _jsxs(Stack, { gap: "md", children: [_jsxs(Group, { gap: "xs", children: [_jsx(MdCalendarToday, { style: { fontSize: 24, color: 'teal' } }), _jsxs("div", { children: [_jsx(Text, { fw: 600, children: dayjs(appointment.scheduled_start).format('MMM D, YYYY') }), _jsx(Text, { size: "sm", c: "dimmed", children: dayjs(appointment.scheduled_start).format('h:mm A') })] })] }), _jsxs(Group, { gap: "xs", children: [_jsx(MdLocationOn, { style: { fontSize: 24, color: 'teal' } }), _jsxs("div", { children: [_jsx(Text, { fw: 600, children: location?.name ?? appointment.location_id }), _jsx(Text, { size: "sm", c: "dimmed", children: [location?.address, location?.city, location?.state].filter(Boolean).join(', ') })] })] })] })] }), _jsxs(Group, { gap: "md", children: [_jsx(Button, { onClick: () => setOpenedModal('reschedule'), children: "Reschedule Appointment" }), _jsx(Button, { variant: "light", color: "red", onClick: () => setOpenedModal('cancel'), disabled: appointment.status === 'cancelled', children: "Cancel Appointment" })] }), _jsx(Modal, { opened: openedModal === 'reschedule', onClose: () => setOpenedModal(null), title: "Reschedule Appointment", children: _jsxs(Stack, { gap: "md", children: [_jsx(Text, { c: "dimmed", children: "Select a new date and time on the booking page. We will preserve this appointment record." }), _jsxs(Group, { justify: "flex-end", gap: "sm", children: [_jsx(Button, { variant: "light", onClick: () => setOpenedModal(null), children: "Close" }), _jsx(Button, { onClick: handleReschedule, children: "Continue to Booking" })] })] }) }), _jsx(Modal, { opened: openedModal === 'cancel', onClose: () => setOpenedModal(null), title: "Cancel Appointment", children: _jsxs(Stack, { gap: "md", children: [_jsx(Textarea, { label: "Reason for cancellation (optional)", placeholder: "Tell us why you're cancelling...", value: cancelReason, onChange: (e) => setCancelReason(e.currentTarget.value) }), _jsxs(Group, { justify: "flex-end", gap: "sm", children: [_jsx(Button, { variant: "light", onClick: () => setOpenedModal(null), children: "Keep Appointment" }), _jsx(Button, { color: "red", onClick: handleCancel, children: "Confirm Cancellation" })] })] }) })] }) }));
};
