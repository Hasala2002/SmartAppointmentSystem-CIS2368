import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Group, Anchor, Text, Box } from "@mantine/core";
export const Footer = () => {
    return (_jsx(Box, { component: "footer", h: 60, display: "flex", style: {
            alignItems: "center",
            borderTop: "1px solid #e9ecef",
            backgroundColor: "white",
        }, children: _jsxs(Container, { size: "lg", h: "100%", display: "flex", style: {
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
            }, children: [_jsx(Text, { size: "sm", children: "\u00A9 2026 Lone Star Dental Group. All rights reserved." }), _jsxs(Group, { gap: "lg", children: [_jsx(Anchor, { href: "#", size: "sm", children: "About" }), _jsx(Anchor, { href: "#", size: "sm", children: "Contact" }), _jsx(Anchor, { href: "#", size: "sm", children: "Privacy Policy" })] })] }) }));
};
