import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Container, 
  Paper, 
  Stack, 
  Title, 
  Text, 
  Badge, 
  Group, 
  Button, 
  Center, 
  Loader,
  Divider,
  Alert,
  Modal
} from '@mantine/core'
import { useAuth } from '../hooks/useAuth'
import { useQueueWebSocket } from '../hooks/useQueueWebSocket'
import { NotificationPrompt } from '../components/NotificationPrompt'
import { apiClient } from '../api/client'

const statusConfig: Record<string, { color: string; label: string; description: string }> = {
  waiting: { 
    color: 'blue', 
    label: 'Waiting', 
    description: 'Please wait for your number to be called' 
  },
  called: { 
    color: 'green', 
    label: "You're Up!", 
    description: 'Please proceed to the counter now' 
  },
  serving: { 
    color: 'teal', 
    label: 'Being Served', 
    description: 'Your appointment is in progress' 
  },
  completed: { 
    color: 'gray', 
    label: 'Completed', 
    description: 'Thank you for visiting!' 
  },
  left: { 
    color: 'gray', 
    label: 'Left Queue', 
    description: 'You have left the queue' 
  }
}

export const QueueStatus = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [queueEntry, setQueueEntry] = useState<any>(null)
  const [locationId, setLocationId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLeaveModal, setShowLeaveModal] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  const { isConnected, queueState, myPosition } = useQueueWebSocket(locationId, queueEntry?.id)

  // Fetch current queue position on mount
  useEffect(() => {
    const fetchQueuePosition = async () => {
      try {
        const response = await apiClient.get('/queue/my-position')
        setQueueEntry(response.data)
        // Get location_id from the queue entry or need to fetch separately
        // For now, assume location_id is not in the response, so we need to handle this
      } catch (err: any) {
        if (err.response?.status === 404) {
          // Not in queue
          setQueueEntry(null)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchQueuePosition()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated])

  // Update from WebSocket
  useEffect(() => {
    if (myPosition) {
      setQueueEntry((prev: any) => ({
        ...prev,
        ...myPosition
      }))
    }
  }, [myPosition])

  const handleLeaveQueue = async () => {
    if (!queueEntry) return

    setIsLeaving(true)
    try {
      await apiClient.delete(`/queue/${queueEntry.id}`)
      setShowLeaveModal(false)
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to leave queue:', err)
    } finally {
      setIsLeaving(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <Center mih="60vh">
        <Stack align="center" gap="md">
          <Text>Please log in to view your queue status</Text>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </Stack>
      </Center>
    )
  }

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (!queueEntry) {
    return (
      <Container size="sm" py="xl">
        <Paper p="xl" withBorder radius="lg" ta="center">
          <Stack align="center" gap="lg">
            <span style={{ fontSize: 64 }}>👥</span>
            <Title order={3}>Not in Queue</Title>
            <Text c="dimmed">
              You're not currently in any queue. Check in for your appointment or join as a walk-in.
            </Text>
            <Group>
              <Button variant="light" onClick={() => navigate('/dashboard')}>
                View Appointments
              </Button>
              <Button onClick={() => navigate('/book')}>
                Book Appointment
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Container>
    )
  }

  const status = statusConfig[queueEntry.status] || statusConfig.waiting
  const waitMins = queueEntry.estimated_wait_mins || 0
  const position = queueEntry.position || 0
  const isCalled = queueEntry.status === 'called'

  return (
    <Container size="sm" py="xl">
      <Stack gap="lg">
        <Button 
          variant="subtle" 
          onClick={() => navigate('/dashboard')}
          w="fit-content"
        >
          ← Back to Dashboard
        </Button>

        <NotificationPrompt />

        {/* Main Queue Card */}
        <Paper 
          p="xl" 
          withBorder 
          radius="lg"
          style={{
            borderColor: isCalled ? 'var(--mantine-color-green-5)' : undefined,
            borderWidth: isCalled ? 2 : 1
          }}
        >
          <Stack align="center" gap="xl">
            {/* Connection Status */}
            <Badge 
              color={isConnected ? 'green' : 'gray'} 
              variant="dot"
              size="sm"
            >
              {isConnected ? 'Live Updates' : 'Connecting...'}
            </Badge>

            {/* Queue Number */}
            <Stack align="center" gap="xs">
              <Text size="sm" c="dimmed" tt="uppercase">Your Number</Text>
              <Title 
                order={1} 
                style={{ fontSize: '4rem', lineHeight: 1 }}
                c={isCalled ? 'green' : undefined}
              >
                {queueEntry.queue_number}
              </Title>
            </Stack>

            {/* Status Badge */}
            <Badge size="xl" color={status.color} variant="light">
              {status.label}
            </Badge>

            <Text ta="center" c="dimmed">{status.description}</Text>

            <Divider w="100%" />

            {/* Position & Wait Time */}
            {queueEntry.status === 'waiting' && (
              <Group grow w="100%">
                <Paper p="md" withBorder radius="md" ta="center">
                  <Stack gap="xs" align="center">
                    <span style={{ fontSize: 24 }}>👥</span>
                    <Text size="2rem" fw={700}>{position}</Text>
                    <Text size="xs" c="dimmed">Position in Queue</Text>
                  </Stack>
                </Paper>

                <Paper p="md" withBorder radius="md" ta="center">
                  <Stack gap="xs" align="center">
                    <span style={{ fontSize: 24 }}>⏱️</span>
                    <Text size="2rem" fw={700}>~{waitMins}</Text>
                    <Text size="xs" c="dimmed">Minutes Wait</Text>
                  </Stack>
                </Paper>
              </Group>
            )}

            {/* Called State */}
            {isCalled && (
              <Alert 
                color="green" 
                icon={<span style={{ fontSize: 20 }}>✓</span>}
                title="Please proceed to the counter"
                w="100%"
              >
                Your turn has arrived! Please make your way to the front desk.
              </Alert>
            )}

            {/* Queue Stats */}
            {queueState && queueEntry.status === 'waiting' && (
              <Paper p="sm" bg="gray.0" radius="md" w="100%">
                <Group justify="center" gap="xl">
                  <Text size="sm" c="dimmed">
                    <strong>{queueState.total_waiting}</strong> people waiting
                  </Text>
                  {queueState.currently_serving && (
                    <Text size="sm" c="dimmed">
                      Now serving: <strong>{queueState.currently_serving}</strong>
                    </Text>
                  )}
                </Group>
              </Paper>
            )}
          </Stack>
        </Paper>

        {/* Leave Queue Button */}
        {['waiting', 'called'].includes(queueEntry.status) && (
          <Button 
            variant="subtle" 
            color="red" 
            onClick={() => setShowLeaveModal(true)}
          >
            Leave Queue
          </Button>
        )}
      </Stack>

      {/* Leave Confirmation Modal */}
      <Modal
        opened={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        title="Leave Queue?"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to leave the queue? You'll lose your position and will need to check in again.
          </Text>
          <Group justify="flex-end">
            <Button variant="light" onClick={() => setShowLeaveModal(false)}>
              Stay in Queue
            </Button>
            <Button color="red" onClick={handleLeaveQueue} loading={isLeaving}>
              Leave Queue
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  )
}
