import { Paper, Stack, Title, Text, Group, Badge, SimpleGrid, Center, Loader } from '@mantine/core'
import { QueueEntry } from '../../api/services/queue'
import { QueueEntryCard } from './QueueEntryCard'
import { CurrentlyServingCard } from './CurrentlyServingCard'

interface QueueBoardProps {
  entries: QueueEntry[]
  currentlyServing: QueueEntry | null
  isConnected: boolean
  onCallNext: () => void
  onStartServing: (id: string) => void
  onComplete: (id: string) => void
  onNoShow: (id: string) => void
  isLoading?: boolean
}

export const QueueBoard = ({
  entries,
  currentlyServing,
  isConnected,
  onCallNext,
  onStartServing,
  onComplete,
  onNoShow,
  isLoading
}: QueueBoardProps) => {
  const waitingEntries = entries.filter(e => e.status === 'waiting')
  const calledEntries = entries.filter(e => e.status === 'called')

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader size="lg" />
      </Center>
    )
  }

  return (
    <Stack gap="lg">
      {/* Connection Status */}
      <Group justify="flex-end">
        <Badge color={isConnected ? 'green' : 'red'} variant="dot">
          {isConnected ? 'Live' : 'Disconnected'}
        </Badge>
      </Group>

      {/* Currently Serving Section */}
      <CurrentlyServingCard
        entry={currentlyServing}
        onComplete={onComplete}
        onNoShow={onNoShow}
      />

      {/* Called Section */}
      {calledEntries.length > 0 && (
        <Paper p="md" withBorder radius="md" bg="green.0">
          <Stack gap="md">
            <Group>
              <Title order={4}>Called</Title>
              <Badge color="green">{calledEntries.length}</Badge>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {calledEntries.map(entry => (
                <QueueEntryCard
                  key={entry.id}
                  entry={entry}
                  onStartServing={() => onStartServing(entry.id)}
                  onNoShow={() => onNoShow(entry.id)}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Paper>
      )}

      {/* Waiting Section */}
      <Paper p="md" withBorder radius="md">
        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <Title order={4}>Waiting</Title>
              <Badge color="blue">{waitingEntries.length}</Badge>
            </Group>
            {waitingEntries.length > 0 && (
              <Text size="sm" c="dimmed">
                Est. total wait: ~{waitingEntries.length * 15} mins
              </Text>
            )}
          </Group>

          {waitingEntries.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <span style={{ fontSize: 48 }}>👥</span>
                <Text c="dimmed">No customers waiting</Text>
              </Stack>
            </Center>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
              {waitingEntries
                .sort((a, b) => a.position - b.position)
                .map(entry => (
                  <QueueEntryCard
                    key={entry.id}
                    entry={entry}
                    onCall={() => onCallNext()}
                  />
                ))}
            </SimpleGrid>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
