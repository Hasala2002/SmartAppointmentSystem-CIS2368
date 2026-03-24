import { Paper, Stack, Title, Text, Group, Badge, Button, Center } from '@mantine/core'
import { QueueEntry } from '../../api/services/queue'
import dayjs from 'dayjs'

interface CurrentlyServingCardProps {
  entry: QueueEntry | null
  onComplete: (id: string) => void
  onNoShow: (id: string) => void
}

export const CurrentlyServingCard = ({ 
  entry, 
  onComplete, 
  onNoShow 
}: CurrentlyServingCardProps) => {
  if (!entry) {
    return (
      <Paper p="xl" withBorder radius="md" bg="gray.0">
        <Center>
          <Stack align="center" gap="md">
            <span style={{ fontSize: 48 }}>👤</span>
            <Text c="dimmed">No one currently being served</Text>
            <Text size="sm" c="dimmed">Call the next customer to begin</Text>
          </Stack>
        </Center>
      </Paper>
    )
  }

  const servingTime = entry.called_at 
    ? dayjs().diff(dayjs(entry.called_at), 'minute')
    : 0

  return (
    <Paper 
      p="xl" 
      withBorder 
      radius="md" 
      style={{
        background: 'linear-gradient(135deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-cyan-0) 100%)',
        borderColor: 'var(--mantine-color-teal-3)'
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Text size="sm" c="dimmed" tt="uppercase" fw={500}>
              Now Serving
            </Text>
            <Title order={1} c="teal">
              {entry.queue_number}
            </Title>
          </Stack>

          <Stack align="flex-end" gap="xs">
            <Badge size="lg" color="teal" variant="light">
              In Progress
            </Badge>
            <Text size="sm" c="dimmed">
              {servingTime > 0 ? `${servingTime} min elapsed` : 'Just started'}
            </Text>
          </Stack>
        </Group>

        <Group grow>
          <Button
            size="lg"
            color="green"
            onClick={() => onComplete(entry.id)}
          >
            Complete
          </Button>
          <Button
            size="lg"
            variant="light"
            color="red"
            onClick={() => onNoShow(entry.id)}
          >
            No-Show
          </Button>
        </Group>
      </Stack>
    </Paper>
  )
}
