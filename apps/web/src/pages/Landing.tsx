import {
  Container,
  Title,
  Text,
  Button,
  Stack,
  SimpleGrid,
  Card,
  Group,
  Box,
  ThemeIcon,
  Badge,
  Divider,
  Paper,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {
  MdLocationOn,
  MdPhone,
  MdAccessTime,
  MdArrowForward,
  MdSentimentSatisfied,
  MdShield,
  MdPeople,
} from "react-icons/md";

const locations = [
  {
    id: "1",
    name: "Houston - Downtown",
    address: "123 Main St",
    city: "Houston",
    state: "TX",
    zip: "77002",
    phone: "(713) 555-0101",
  },
  {
    id: "2",
    name: "Houston - Galleria",
    address: "456 Westheimer Rd",
    city: "Houston",
    state: "TX",
    zip: "77056",
    phone: "(713) 555-0102",
  },
  {
    id: "3",
    name: "Austin - Central",
    address: "789 Congress Ave",
    city: "Austin",
    state: "TX",
    zip: "78701",
    phone: "(512) 555-0103",
  },
  {
    id: "4",
    name: "Austin - Round Rock",
    address: "321 Palm Valley Blvd",
    city: "Round Rock",
    state: "TX",
    zip: "78664",
    phone: "(512) 555-0104",
  },
  {
    id: "5",
    name: "Dallas - Uptown",
    address: "555 McKinney Ave",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    phone: "(214) 555-0105",
  },
  {
    id: "6",
    name: "Fort Worth - Sundance",
    address: "888 Sundance Square",
    city: "Fort Worth",
    state: "TX",
    zip: "76102",
    phone: "(817) 555-0106",
  },
];

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

  return (
    <Stack gap={0}>
      {/* Hero Section */}
      <Box
        style={{
          background:
            "linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-cyan-6) 100%)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <Box
          style={{
            position: "absolute",
            top: "-50%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "-30%",
            left: "-5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
          <Stack gap="xl" align="center" ta="center">
            <Badge size="lg" variant="white" color="teal">
              Now Accepting New Patients
            </Badge>

            <Title
              c="white"
              fw={800}
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", lineHeight: 1.1 }}
            >
              Your Smile,
              <br />
              Our Priority
            </Title>

            <Text c="white" size="xl" maw={600} style={{ opacity: 0.9 }}>
              Serving Houston, Austin, and DFW with 6 convenient locations.
              Experience gentle, personalized dental care for the whole family.
            </Text>

            <Group gap="md" mt="md">
              <Button
                size="xl"
                color="white"
                variant="white"
                radius="xl"
                rightSection={
                  <MdArrowForward color="var(--mantine-color-teal-6)" />
                }
                onClick={() => navigate("/book")}
                styles={{
                  root: {
                    color: "var(--mantine-color-teal-6)",
                    fontWeight: 600,
                  },
                }}
              >
                Book Appointment
              </Button>
              <Button
                size="xl"
                variant="outline"
                color="white"
                radius="xl"
                onClick={() => {
                  document
                    .getElementById("locations")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Find a Location
              </Button>
            </Group>

            <Group gap="xl" mt="xl">
              {[
                { label: "15k+", sublabel: "Happy Patients" },
                { label: "6", sublabel: "Locations" },
                { label: "10+", sublabel: "Years Experience" },
              ].map((stat) => (
                <Stack key={stat.label} gap={0} align="center">
                  <Text c="white" fw={700} size="2rem">
                    {stat.label}
                  </Text>
                  <Text c="white" size="sm" style={{ opacity: 0.8 }}>
                    {stat.sublabel}
                  </Text>
                </Stack>
              ))}
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* Locations Section */}
      <Box bg="gray.0" py={80} id="locations">
        <Container size="lg">
          <Stack gap="xl">
            <Stack gap="xs" ta="center" maw={600} mx="auto">
              <Text c="teal" fw={600} tt="uppercase" size="sm">
                Our Locations
              </Text>
              <Title order={2}>Find a Clinic Near You</Title>
              <Text c="dimmed">
                Visit any of our 6 convenient dental clinics across Texas
              </Text>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg" mt="xl">
              {locations.map((location) => (
                <Card
                  key={location.id}
                  padding="xl"
                  radius="lg"
                  withBorder
                  style={{
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "var(--mantine-shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => navigate("/book")}
                >
                  <Stack gap="md">
                    <Group>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        variant="light"
                        color="teal"
                      >
                        <MdLocationOn color="var(--mantine-color-teal-6)" />
                      </ThemeIcon>
                      <div>
                        <Text fw={600}>{location.name}</Text>
                        <Text size="sm" c="dimmed">
                          {location.address}
                        </Text>
                      </div>
                    </Group>

                    <Divider />

                    <Stack gap="xs">
                      <Group gap="xs">
                        <MdLocationOn
                          color="var(--mantine-color-gray-5)"
                          size={16}
                        />
                        <Text size="sm" c="dimmed">
                          {location.city}, {location.state} {location.zip}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <MdPhone
                          color="var(--mantine-color-gray-5)"
                          size={16}
                        />
                        <Text size="sm" c="dimmed">
                          {location.phone}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <MdAccessTime
                          color="var(--mantine-color-gray-5)"
                          size={16}
                        />
                        <Text size="sm" c="dimmed">
                          Mon-Fri: 9AM - 5PM
                        </Text>
                      </Group>
                    </Stack>

                    <Button
                      variant="light"
                      color="teal"
                      fullWidth
                      mt="sm"
                      radius="md"
                    >
                      Book at this location
                    </Button>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={80}>
        <Container size="md">
          <Paper
            p={48}
            radius="xl"
            style={{
              background:
                "linear-gradient(135deg, var(--mantine-color-teal-6) 0%, var(--mantine-color-cyan-6) 100%)",
              textAlign: "center",
            }}
          >
            <Stack align="center" gap="lg">
              <Title order={2} c="white">
                Ready for a Healthier Smile?
              </Title>
              <Text c="white" size="lg" maw={400} style={{ opacity: 0.9 }}>
                Schedule your appointment today and take the first step towards
                better dental health.
              </Text>
              <Button
                size="xl"
                variant="white"
                color="teal"
                radius="xl"
                onClick={() => navigate("/book")}
                styles={{
                  root: {
                    color: "var(--mantine-color-teal-6)",
                    fontWeight: 600,
                  },
                }}
              >
                Book Your Visit
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Stack>
  );
};
