import { SimpleGrid, Card, Stack, Text, Group, Button } from '@mantine/core'
import { Location } from '../../types'
import { MdLocationOn } from 'react-icons/md'

interface LocationPickerProps {
  locations: Location[]
  selectedId?: string
  onSelect: (locationId: string) => void
}

export const LocationPicker = ({ locations, selectedId, onSelect }: LocationPickerProps) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {locations.map((location) => (
        <Card
          key={location.id}
          padding="lg"
          radius="md"
          withBorder
          style={{
            borderColor: selectedId === location.id ? 'teal' : 'var(--mantine-color-gray-3)',
            borderWidth: selectedId === location.id ? 3 : 1,
            backgroundColor:
              selectedId === location.id ? 'rgba(0, 150, 136, 0.05)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => onSelect(location.id)}
        >
          <Stack gap="sm">
            <Group gap="xs">
              <MdLocationOn style={{ fontSize: 20, color: 'teal' }} />
              <Text fw={600} size="sm">
                {location.name}
              </Text>
            </Group>
            <Stack gap={4}>
              <Text size="sm" c="dimmed">
                {location.address}
              </Text>
              <Text size="sm" c="dimmed">
                {location.city}, {location.state}
              </Text>
              <Text size="sm" c="dimmed">
                {location.phone}
              </Text>
            </Stack>
            <Button fullWidth size="xs" variant={selectedId === location.id ? 'filled' : 'light'}>
              {selectedId === location.id ? 'Selected' : 'Book Here'}
            </Button>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
