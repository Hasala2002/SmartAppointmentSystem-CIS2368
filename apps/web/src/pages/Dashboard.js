import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Container, Title, Text, Button, Stack, Tabs } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { listAppointmentsRequest, mapApiAppointment } from '../api/appointments';
const DEFAULT_PATIENT_INFO = {
    dateOfBirth: '',
    hasInsurance: 'no',
    lastDentalVisit: 'never',
    hasDentalPain: 'no',
};
export const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const loadAppointments = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const apiAppointments = await listAppointmentsRequest();
                setAppointments(apiAppointments.map((appt) => mapApiAppointment(appt, DEFAULT_PATIENT_INFO)));
            }
            catch {
                setError('Unable to load appointments right now.');
            }
            finally {
                setIsLoading(false);
            }
        };
        void loadAppointments();
    }, []);
    const upcoming = appointments.filter((apt) => dayjs(apt.scheduledStart).isAfter(dayjs()));
    const past = appointments.filter((apt) => !dayjs(apt.scheduledStart).isAfter(dayjs()));
    return (_jsx(Container, { size: "lg", py: "xl", children: _jsxs(Stack, { gap: "xl", children: [_jsxs("div", { children: [_jsxs(Title, { order: 1, mb: "xs", children: ["Welcome back, ", user?.firstName, "!"] }), _jsx(Text, { c: "dimmed", mb: "lg", children: "Manage your dental appointments" }), _jsx(Button, { onClick: () => navigate('/book'), children: "Book New Appointment" })] }), _jsxs(Tabs, { defaultValue: "upcoming", children: [_jsxs(Tabs.List, { children: [_jsxs(Tabs.Tab, { value: "upcoming", children: ["Upcoming Appointments (", upcoming.length, ")"] }), _jsxs(Tabs.Tab, { value: "past", children: ["Past Appointments (", past.length, ")"] })] }), _jsxs(Tabs.Panel, { value: "upcoming", pt: "lg", children: [isLoading && _jsx(Text, { c: "dimmed", children: "Loading appointments..." }), error && _jsx(Text, { c: "red", children: error }), upcoming.length > 0 ? (_jsx(Stack, { gap: "md", children: upcoming.map((apt) => (_jsx(AppointmentCard, { appointment: apt }, apt.id))) })) : (_jsxs(Stack, { gap: "md", align: "center", py: "xl", children: [_jsx(Text, { c: "dimmed", children: "No upcoming appointments" }), _jsx(Button, { onClick: () => navigate('/book'), children: "Book your first appointment" })] }))] }), _jsxs(Tabs.Panel, { value: "past", pt: "lg", children: [isLoading && _jsx(Text, { c: "dimmed", children: "Loading appointments..." }), error && _jsx(Text, { c: "red", children: error }), past.length > 0 ? (_jsx(Stack, { gap: "md", children: past.map((apt) => (_jsx(AppointmentCard, { appointment: apt }, apt.id))) })) : (_jsx(Text, { c: "dimmed", ta: "center", py: "xl", children: "No past appointments" }))] })] })] }) }));
};
