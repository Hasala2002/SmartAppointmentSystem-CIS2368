import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Stack, Text, Button, SimpleGrid } from '@mantine/core';
export const TimeSlotPicker = ({ selectedTime, onSelect, slots, isLoading }) => {
    if (isLoading) {
        return _jsx(Text, { c: "dimmed", children: "Loading available time slots..." });
    }
    if (slots.length === 0) {
        return _jsx(Text, { c: "dimmed", children: "No available slots for this date." });
    }
    return (_jsxs(Stack, { gap: "md", children: [_jsx(Text, { fw: 600, size: "lg", children: "Available Time Slots" }), _jsx(SimpleGrid, { cols: { base: 2, sm: 4, md: 6 }, spacing: "sm", children: slots.map((slot) => (_jsx(Button, { variant: selectedTime === slot.start ? 'filled' : 'light', disabled: !slot.available, onClick: () => onSelect(slot.start), size: "sm", children: slot.start }, slot.start))) })] }));
};
