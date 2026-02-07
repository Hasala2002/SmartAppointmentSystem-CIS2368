import { Container, Title, Text, Button, Stack, SimpleGrid, Card, Group, Paper } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { LocationPicker } from '../components/booking/LocationPicker'
import { IonLocationSharp } from '@ionic/react'

export const Landing = () => {
  const navigate = useNavigate()

  return (
    <Stack gap="0" min={'100vh'} display="flex" style={{ flexDirection: 'column' }}>
      {/* Hero Section */}
      <Container size="lg" py="xl" style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Stack gap="lg" style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title size={56} fw={700} mb="md">
              Your Smile, Our Priority
            </Title>
            <Text size="xl" c="dimmed">
              Serving Houston, Austin, and DFW with 6 convenient locations
            </Text>
          </div>

          <Group justify="center" gap="md">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
            >
              Book Appointment
            </Button>
            <Button
              size="lg"
              variant="light"
              onClick={() => {
                const element = document.getElementById('locations')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Find a Location
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* Locations Section */}
      <Container size="lg" py="xl" id="locations">
        <Stack gap="lg">
          <div>
            <Title order={2} mb="md">
              Our Locations
            </Title>
            <Text c="dimmed" mb="lg">
              Visit any of our 6 convenient dental clinics in the greater Houston, Austin, and Dallas areas
            </Text>
          </div>

          <LocationPicker selectedId={undefined} onSelect={(id) => navigate('/login')} />
        </Stack>
      </Container>
    </Stack>
  )
}
