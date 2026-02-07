import { SimpleGrid, Card, Stack, Text, Group, Button, Badge } from '@mantine/core'
import { Location } from '../../types'
import { MdLocationOn } from 'react-icons/md'

interface LocationPickerProps {
  selectedId?: string
  onSelect: (locationId: string) => void
}

const LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'Houston - Downtown',
    address: '123 Main St',
    city: 'Houston',
    state: 'TX',
    phone: '(713) 555-0100',
  },
  {
    id: '2',
    name: 'Houston - Galleria',
    address: '456 Westheimer Rd',
    city: 'Houston',
    state: 'TX',
    phone: '(713) 555-0101',
  },
  {
    id: '3',
    name: 'Austin - Central',
    address: '789 Congress Ave',
    city: 'Austin',
    state: 'TX',
    phone: '(512) 555-0102',
  },
  {
    id: '4',
    name: 'Austin - Round Rock',
    address: '321 Palm Valley Blvd',
    city: 'Round Rock',
    state: 'TX',
    phone: '(512) 555-0103',
  },
  {
    id: '5',
    name: 'Dallas - Uptown',
    address: '555 McKinney Ave',
    city: 'Dallas',
    state: 'TX',
    phone: '(972) 555-0104',
  },
  {
    id: '6',
    name: 'Fort Worth - Sundance',
    address: '888 Sundance Square',
    city: 'Fort Worth',
    state: 'TX',
    phone: '(817) 555-0105',
  },
]

export const LocationPicker = ({ selectedId, onSelect }: LocationPickerProps) => {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
      {LOCATIONS.map((location) => (
        <Card
          key={location.id}
          padding="lg"
          radius="md"
          withBorder
          style={{
            borderColor: selectedId === location.id ? 'teal' : 'var(--mantine-color-gray-3)',
            borderWidth: selectedId === location.id ? 3 : 1,
            backgroundColor: selectedId === location.id ? 'rgba(0, 150, 136, 0.05)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={() => onSelect(location.id)}
        >
          <Stack gap="sm">
            <Group gap="xs">
              <MdLocationOn style={{ fontSize: 20, color: 'teal' }} />
              <div>
                <Text fw={600} size="sm">
                  {location.name}
                </Text>
              </div>
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
