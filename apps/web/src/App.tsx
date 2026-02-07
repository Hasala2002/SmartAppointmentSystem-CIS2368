import { MantineProvider, Box } from "@mantine/core";
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

const theme = {
  primaryColor: "teal",
  fontFamily:
    '"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontFamilyMonospace: '"Inter", "Monaco", "Courier New", monospace',
  headings: {
    fontFamily:
      '"Instrument Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
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
};

function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Box
          display="flex"
          style={{ flexDirection: "column", minHeight: "100vh" }}
        >
          <Navbar />
          <Box component="main" style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book" element={<BookingFlow />} />
              <Route
                path="/appointments/:id"
                element={<AppointmentDetails />}
              />
            </Routes>
          </Box>
          <Footer />
        </Box>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
