import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MantineProvider, Box, createTheme } from "@mantine/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { BookingFlow } from "./pages/BookingFlow";
import { AppointmentDetails } from "./pages/AppointmentDetails";
import "@mantine/dates/styles.css";
const theme = createTheme({
    primaryColor: "teal",
    fontFamily: '"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontFamilyMonospace: '"Inter", "Monaco", "Courier New", monospace',
    headings: {
        fontFamily: '"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontWeight: "600",
    },
    colors: {
        teal: [
            "#e3f5f5",
            "#c3ebe9",
            "#a0dfe0",
            "#7ad3d6",
            "#5acad0",
            "#47c5cc",
            "#3ec3ca",
            "#2faaa7",
            "#249695",
            "#098586",
        ],
    },
});
function App() {
    return (_jsx(MantineProvider, { theme: theme, children: _jsx(BrowserRouter, { children: _jsxs(Box, { display: "flex", style: { flexDirection: "column", minHeight: "100vh" }, children: [_jsx(Navbar, {}), _jsx(Box, { component: "main", style: { flex: 1 }, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Landing, {}) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/book", element: _jsx(BookingFlow, {}) }), _jsx(Route, { path: "/appointments/:id", element: _jsx(AppointmentDetails, {}) })] }) }), _jsx(Footer, {})] }) }) }));
}
export default App;
