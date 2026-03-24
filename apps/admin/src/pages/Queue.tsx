import { useState, useEffect } from 'react'
import {
  Stack,
  Paper,
  Button,
  Group,
  Badge,
  Title,
  Text,
  Table,
  Card,
  Select,
  Loader,
  Alert,
  ActionIcon,
  Tooltip,
  SimpleGrid
} from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'
import { apiClient } from '../api/client'
import { useQueueWebSocket } from '../hooks/useQueueWebSocket'

interface Location {
  id: string
  name: string
}

interface QueueEntry {
  id: string
  queue_number: string
  position: number
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'left'
  estimated_wait_mins: number | null
  customer_id: string
  joined_at: string
  called_at?: string
  serving_started_at?: string
}

const STATUS_COLORS = {
  waiting: 'blue',
  called: 'orange',
  serving: 'cyan',
  completed: 'green',
  left: 'gray'
}

const STATUS_LABELS = {
  waiting: 'Waiting',
  called: 'Called',
  serving: 'Serving',
  completed: 'Completed',
  left: 'Left'
}

export function Queue() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { isConnected, queueState } = useQueueWebSocket(selectedLocation)

  // Load locations
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await apiClient.get('/locations')
        setLocations(response.data || [])
        if (response.data?.length > 0 && !selectedLocation) {
          setSelectedLocation(response.data[0].id)
        }
      } catch (err) {
        console.error('Failed to load locations:', err)
      }
    }
    loadLocations()
  }, [])

  const waitingEntries = queueState?.entries?.filter(e => e.status === 'waiting') || []
  const servingEntry = queueState?.entries?.find(e => e.status === 'serving')
  const calledEntry = queueState?.entries?.find(e => e.status === 'called')

  const handleCallNext = async () => {
    if (!selectedLocation) return
    setLoading(true)
    try {
      await apiClient.post(`/queue/call-next/${selectedLocation}`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to call next customer')
    } finally {
      setLoading(false)
    }
  }

  const handleStartServing = async (entryId: string) => {
    setLoading(true)
    try {
      await apiClient.post(`/queue/${entryId}/start-serving`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to start serving')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (entryId: string) => {
    setLoading(true)
    try {
      await apiClient.post(`/queue/${entryId}/complete`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete serving')
    } finally {
      setLoading(false)
    }
  }

  const handleNoShow = async (entryId: string) => {
    setLoading(true)
    try {
      await apiClient.post(`/queue/${entryId}/no-show`)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to mark no-show')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Stack gap="lg">
      <PageHeader
        title="Queue Management"
        subtitle="Manage your queue in real-time"
        actions={
          <Group>
            <Badge
              color={isConnected ? 'green' : 'gray'}
              variant="dot"
            >
              {isConnected ? 'Live' : 'Connecting...'}
            </Badge>
            <Select
              placeholder="Select location"
              value={selectedLocation}
              onChange={setSelectedLocation}
              data={locations.map(l => ({ value: l.id, label: l.name }))}
              w={200}
            />
          </Group>
        }
      />

      {error && (
        <Alert color="red" onClose={() => setError(null)} withCloseButton>
          {error}
        </Alert>
      )}

      {/* Queue Summary Cards */}
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <Card withBorder padding="lg">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed" tt="uppercase">Waiting</Text>
            <Title order={2}>{waitingEntries.length}</Title>
          </Stack>
        </Card>

        <Card withBorder padding="lg">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed" tt="uppercase">Called</Text>
            <Title order={2}>{calledEntry ? '1' : '0'}</Title>
          </Stack>
        </Card>

        <Card withBorder padding="lg">
          <Stack gap="xs" align="center">
            <Text size="sm" c="dimmed" tt="uppercase">Serving</Text>
            <Title order={2}>{servingEntry ? '1' : '0'}</Title>
          </Stack>
        </Card>
      </SimpleGrid>

      {/* Currently Serving */}
      {servingEntry && (
        <Paper p="md" withBorder radius="md" bg="cyan.0">
          <Group justify="space-between" align="center">
            <Group>
              <Title order={3}>{servingEntry.queue_number}</Title>
              <Badge color="cyan" size="lg">Currently Serving</Badge>
            </Group>
            <Group>
              <Button
                onClick={() => handleComplete(servingEntry.id)}
                loading={loading}
                variant="light"
                color="green"
              >
                Complete
              </Button>
              <Button
                onClick={() => handleNoShow(servingEntry.id)}
                loading={loading}
                variant="subtle"
                color="gray"
              >
                No Show
              </Button>
            </Group>
          </Group>
        </Paper>
      )}

      {/* Called Customer */}
      {calledEntry && (
        <Paper p="md" withBorder radius="md" bg="orange.0">
          <Group justify="space-between" align="center">
            <Group>
              <Title order={3}>{calledEntry.queue_number}</Title>
              <Badge color="orange" size="lg">Called</Badge>
              <Text c="dimmed">Waiting for customer to proceed</Text>
            </Group>
            <Group>
              <Button
                onClick={() => handleStartServing(calledEntry.id)}
                loading={loading}
              >
                Start Serving
              </Button>
              <Button
                onClick={() => handleNoShow(calledEntry.id)}
                loading={loading}
                variant="subtle"
                color="gray"
              >
                No Show
              </Button>
            </Group>
          </Group>
        </Paper>
      )}

      {/* Call Next Button */}
      <Button
        size="xl"
        onClick={handleCallNext}
        loading={loading}
        disabled={waitingEntries.length === 0}
        fullWidth
      >
        {waitingEntries.length > 0
          ? `Call Next: ${waitingEntries[0].queue_number}`
          : 'No Customers Waiting'}
      </Button>

      {/* Waiting List */}
      <Paper withBorder radius="md">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Position</Table.Th>
              <Table.Th>Queue #</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Wait Time</Table.Th>
              <Table.Th>Joined</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {waitingEntries.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5}>
                  <Text ta="center" c="dimmed" py="xl">
                    No customers waiting in queue
                  </Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              waitingEntries.map((entry) => (
                <Table.Tr key={entry.id}>
                  <Table.Td>
                    <Text fw={700}>{entry.position}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fw={600}>{entry.queue_number}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={STATUS_COLORS[entry.status]}>
                      {STATUS_LABELS[entry.status]}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text>{entry.estimated_wait_mins} min</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="dimmed">
                      {new Date(entry.joined_at).toLocaleTimeString()}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  )
}
