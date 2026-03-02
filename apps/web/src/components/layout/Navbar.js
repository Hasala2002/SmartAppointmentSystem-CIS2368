import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Group, Button, Menu, Avatar, Container, Box, Image, Text } from "@mantine/core";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
export const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsx(Box, { component: "nav", h: 60, display: "flex", style: {
            alignItems: "center",
            borderBottom: "1px solid #e9ecef",
            backgroundColor: "white",
        }, children: _jsxs(Container, { size: "lg", h: "100%", display: "flex", style: {
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
            }, children: [_jsx(RouterLink, { to: "/", style: { textDecoration: "none", color: "inherit" }, children: _jsxs(Group, { gap: "sm", children: [_jsx(Image, { src: "/logo.png", alt: "Lone Star Dental Logo", h: 25, w: 25, fit: "contain" }), _jsx(Text, { style: { fontSize: 20, fontWeight: "bold", color: "teal" }, children: "Lone Star Dental" })] }) }), _jsx(Group, { gap: "md", children: user ? (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "subtle", component: RouterLink, to: "/dashboard", children: "Dashboard" }), _jsx(Button, { variant: "subtle", component: RouterLink, to: "/book", children: "Book" }), _jsxs(Menu, { children: [_jsx(Menu.Target, { children: _jsxs(Avatar, { color: "teal", radius: "xl", style: { cursor: "pointer" }, children: [user.firstName[0], user.lastName[0]] }) }), _jsxs(Menu.Dropdown, { children: [_jsxs(Menu.Item, { disabled: true, children: [user.firstName, " ", user.lastName] }), _jsx(Menu.Divider, {}), _jsx(Menu.Item, { onClick: handleLogout, children: "Logout" })] })] })] })) : (_jsxs(_Fragment, { children: [_jsx(Button, { variant: "default", component: RouterLink, to: "/login", children: "Login" }), _jsx(Button, { component: RouterLink, to: "/register", children: "Sign Up" })] })) })] }) }));
};
