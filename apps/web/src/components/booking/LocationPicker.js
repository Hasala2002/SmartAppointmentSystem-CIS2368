import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { SimpleGrid, Card, Stack, Text, Group, Button } from '@mantine/core';
import { MdLocationOn } from 'react-icons/md';
export const LocationPicker = ({ locations, selectedId, onSelect }) => {
    return (_jsx(SimpleGrid, { cols: { base: 1, sm: 2, md: 3 }, spacing: "lg", children: locations.map((location) => (_jsx(Card, { padding: "lg", radius: "md", withBorder: true, style: {
                borderColor: selectedId === location.id ? 'teal' : 'var(--mantine-color-gray-3)',
                borderWidth: selectedId === location.id ? 3 : 1,
                backgroundColor: selectedId === location.id ? 'rgba(0, 150, 136, 0.05)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
            }, onClick: () => onSelect(location.id), children: _jsxs(Stack, { gap: "sm", children: [_jsxs(Group, { gap: "xs", children: [_jsx(MdLocationOn, { style: { fontSize: 20, color: 'teal' } }), _jsx(Text, { fw: 600, size: "sm", children: location.name })] }), _jsxs(Stack, { gap: 4, children: [_jsx(Text, { size: "sm", c: "dimmed", children: location.address }), _jsxs(Text, { size: "sm", c: "dimmed", children: [location.city, ", ", location.state] }), _jsx(Text, { size: "sm", c: "dimmed", children: location.phone })] }), _jsx(Button, { fullWidth: true, size: "xs", variant: selectedId === location.id ? 'filled' : 'light', children: selectedId === location.id ? 'Selected' : 'Book Here' })] }) }, location.id))) }));
};
