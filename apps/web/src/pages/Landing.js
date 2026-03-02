import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Container, Title, Text, Button, Stack, SimpleGrid, Card, Group, Box, ThemeIcon, Badge, Divider, Paper, } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { MdLocationOn, MdPhone, MdAccessTime, MdArrowForward, MdSentimentSatisfied, MdShield, MdPeople, } from "react-icons/md";
import { useEffect, useState } from "react";
import { listLocationsRequest } from "../api/locations";
const features = [
    {
        icon: MdSentimentSatisfied,
        title: "Patient-First Care",
        description: "Your comfort and health are our top priorities",
    },
    {
        icon: MdShield,
        title: "Modern Technology",
        description: "State-of-the-art equipment for precise treatment",
    },
    {
        icon: MdPeople,
        title: "Expert Team",
        description: "Experienced dentists and friendly staff",
    },
];
export const Landing = () => {
    const navigate = useNavigate();
    const [locations, setLocations] = useState([]);
    useEffect(() => {
        const loadLocations = async () => {
            const data = await listLocationsRequest();
            setLocations(data.map((loc) => ({
                id: loc.id,
                name: loc.name,
                address: loc.address ?? "",
                city: loc.city ?? "",
                state: loc.state ?? "",
                zip: loc.zip_code ?? "",
                phone: loc.phone ?? "",
            })));
        };
        void loadLocations();
    }, []);
    return (_jsxs(Stack, { gap: 0, children: [_jsxs(Box, { style: {
                    background: "linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-cyan-6) 100%)",
                    minHeight: "80vh",
                    display: "flex",
                    alignItems: "center",
                    position: "relative",
                    overflow: "hidden",
                }, children: [_jsx(Box, { style: {
                            position: "absolute",
                            top: "-50%",
                            right: "-10%",
                            width: "600px",
                            height: "600px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.1)",
                        } }), _jsx(Box, { style: {
                            position: "absolute",
                            bottom: "-30%",
                            left: "-5%",
                            width: "400px",
                            height: "400px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.05)",
                        } }), _jsx(Container, { size: "lg", style: { position: "relative", zIndex: 1 }, children: _jsxs(Stack, { gap: "xl", align: "center", ta: "center", children: [_jsx(Badge, { size: "lg", variant: "white", color: "teal", children: "Now Accepting New Patients" }), _jsxs(Title, { c: "white", fw: 800, style: { fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }, children: ["Your Smile,", _jsx("br", {}), "Our Priority"] }), _jsx(Text, { c: "white", size: "xl", maw: 600, style: { opacity: 0.9 }, children: "Serving Houston, Austin, and DFW with 6 convenient locations. Experience gentle, personalized dental care for the whole family." }), _jsxs(Group, { gap: "md", mt: "md", children: [_jsx(Button, { size: "xl", color: "white", variant: "white", radius: "xl", rightSection: _jsx(MdArrowForward, { color: "var(--mantine-color-teal-6)" }), onClick: () => navigate("/book"), styles: {
                                                root: {
                                                    color: "var(--mantine-color-teal-6)",
                                                    fontWeight: 600,
                                                },
                                            }, children: "Book Appointment" }), _jsx(Button, { size: "xl", variant: "outline", color: "white", radius: "xl", onClick: () => {
                                                document
                                                    .getElementById("locations")
                                                    ?.scrollIntoView({ behavior: "smooth" });
                                            }, children: "Find a Location" })] }), _jsx(Group, { gap: "xl", mt: "xl", children: [
                                        { label: "15k+", sublabel: "Happy Patients" },
                                        { label: "6", sublabel: "Locations" },
                                        { label: "10+", sublabel: "Years Experience" },
                                    ].map((stat) => (_jsxs(Stack, { gap: 0, align: "center", children: [_jsx(Text, { c: "white", fw: 700, size: "2rem", children: stat.label }), _jsx(Text, { c: "white", size: "sm", style: { opacity: 0.8 }, children: stat.sublabel })] }, stat.label))) })] }) })] }), _jsx(Box, { bg: "gray.0", py: 80, id: "locations", children: _jsx(Container, { size: "lg", children: _jsxs(Stack, { gap: "xl", children: [_jsxs(Stack, { gap: "xs", ta: "center", maw: 600, mx: "auto", children: [_jsx(Text, { c: "teal", fw: 600, tt: "uppercase", size: "sm", children: "Our Locations" }), _jsx(Title, { order: 2, children: "Find a Clinic Near You" }), _jsx(Text, { c: "dimmed", children: "Visit any of our 6 convenient dental clinics across Texas" })] }), _jsx(SimpleGrid, { cols: { base: 1, sm: 2, lg: 3 }, spacing: "lg", mt: "xl", children: locations.map((location) => (_jsx(Card, { padding: "xl", radius: "lg", withBorder: true, style: {
                                        cursor: "pointer",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                    }, onMouseEnter: (e) => {
                                        e.currentTarget.style.transform = "translateY(-4px)";
                                        e.currentTarget.style.boxShadow =
                                            "var(--mantine-shadow-lg)";
                                    }, onMouseLeave: (e) => {
                                        e.currentTarget.style.transform = "translateY(0)";
                                        e.currentTarget.style.boxShadow = "none";
                                    }, onClick: () => navigate("/book"), children: _jsxs(Stack, { gap: "md", children: [_jsxs(Group, { children: [_jsx(ThemeIcon, { size: "lg", radius: "md", variant: "light", color: "teal", children: _jsx(MdLocationOn, { color: "var(--mantine-color-teal-6)" }) }), _jsxs("div", { children: [_jsx(Text, { fw: 600, children: location.name }), _jsx(Text, { size: "sm", c: "dimmed", children: location.address })] })] }), _jsx(Divider, {}), _jsxs(Stack, { gap: "xs", children: [_jsxs(Group, { gap: "xs", children: [_jsx(MdLocationOn, { color: "var(--mantine-color-gray-5)", size: 16 }), _jsxs(Text, { size: "sm", c: "dimmed", children: [location.city, ", ", location.state, " ", location.zip] })] }), _jsxs(Group, { gap: "xs", children: [_jsx(MdPhone, { color: "var(--mantine-color-gray-5)", size: 16 }), _jsx(Text, { size: "sm", c: "dimmed", children: location.phone })] }), _jsxs(Group, { gap: "xs", children: [_jsx(MdAccessTime, { color: "var(--mantine-color-gray-5)", size: 16 }), _jsx(Text, { size: "sm", c: "dimmed", children: "Mon-Fri: 9AM - 5PM" })] })] }), _jsx(Button, { variant: "light", color: "teal", fullWidth: true, mt: "sm", radius: "md", children: "Book at this location" })] }) }, location.id))) })] }) }) }), _jsx(Box, { py: 80, children: _jsx(Container, { size: "md", children: _jsx(Paper, { p: 48, radius: "xl", style: {
                            background: "linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-cyan-6) 100%)",
                            textAlign: "center",
                        }, children: _jsxs(Stack, { align: "center", gap: "lg", children: [_jsx(Title, { order: 2, c: "white", children: "Ready for a Healthier Smile?" }), _jsx(Text, { c: "white", size: "lg", maw: 400, style: { opacity: 0.9 }, children: "Schedule your appointment today and take the first step towards better dental health." }), _jsx(Button, { size: "xl", variant: "white", color: "teal", radius: "xl", onClick: () => navigate("/book"), styles: {
                                        root: {
                                            color: "var(--mantine-color-teal-6)",
                                            fontWeight: 600,
                                        },
                                    }, children: "Book Your Visit" })] }) }) }) })] }));
};
