import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, Group, Text, Badge, Anchor, Stack } from '@mantine/core';
import { Link as RouterLink } from 'react-router-dom';
import { MdCalendarToday, MdAccessTime, MdLocationOn } from 'react-icons/md';
const STATUS_COLORS = {
    pending: 'yellow',
    confirmed: 'green',
    checked_in: 'cyan',
    in_progress: 'teal',
    completed: 'blue',
    cancelled: 'red',
    no_show: 'gray',
};
export const AppointmentCard = ({ appointment }) => {
    return (_jsx(Card, { withBorder: true, padding: "lg", radius: "md", children: _jsxs(Stack, { gap: "md", children: [_jsxs(Group, { justify: "space-between", children: [_jsxs(Stack, { gap: 4, children: [_jsxs(Group, { gap: "xs", children: [_jsx(MdCalendarToday, { style: { fontSize: 18, color: 'teal' } }), _jsx(Text, { fw: 600, children: appointment.date })] }), _jsxs(Group, { gap: "xs", children: [_jsx(MdAccessTime, { style: { fontSize: 18, color: 'teal' } }), _jsx(Text, { size: "sm", children: appointment.time })] })] }), _jsx(Badge, { color: STATUS_COLORS[appointment.status], children: appointment.status })] }), _jsxs(Group, { gap: "xs", children: [_jsx(MdLocationOn, { style: { fontSize: 18, color: 'teal' } }), _jsxs(Text, { size: "sm", c: "dimmed", children: ["Location ID: ", appointment.locationId] })] }), _jsx(Anchor, { component: RouterLink, to: `/appointments/${appointment.id}`, size: "sm", children: "View Details \u2192" })] }) }));
};
