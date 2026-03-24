import { Paper, Stack, Text, Group, Badge, Button, ActionIcon, Menu } from '@mantine/core'
import { QueueEntry } from '../../api/services/queue'
import dayjs from 'dayjs'

interface QueueEntryCardProps {
  entry: QueueEntry
  onCall?: () => void
  onStartServing?: () => void
  onNoShow?: () => void
}

const statusConfig: Record<string, { color: string; label: string }> = {
  waiting: { color: 'blue', label: 'Waiting' },
  called: { color: 'green', label: 'Called' },
  serving: { color: 'teal', label: 'Serving' },
  completed: { color: 'gray', label: 'Completed' },
  left: { color: 'red', label: 'Left' }
}

export const QueueEntryCard = ({ 
  entry, 
  onCall, 
  onStartServing, 
  onNoShow 
}: QueueEntryCardProps) => {
  const status = statusConfig[entry.status] || statusConfig.waiting
  const waitTime = entry.joined_at ? dayjs().diff(dayjs(entry.joined_at), 'minute') : 0

  return (
    <Paper 
      p="md" 
      withBorder 
      radius="md"
      style={{
        borderLeftWidth: 4,
        borderLeftColor: `var(--mantine-color-${status.color}-5)`
      }}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Stack gap={2}>
            <Text size="xl" fw={700}>{entry.queue_number}</Text>
            <Badge size="sm" color={status.color} variant="light">
              {status.label}
            </Badge>
          </Stack>

          <Menu position="bottom-end" withArrow>
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <span style={{ fontSize: 16 }}>⋯</span>
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {entry.status === 'waiting' && onCall && (
                <Menu.Item onClick={onCall}>
                  Call Customer
                </Menu.Item>
              )}
              {entry.status === 'called' && onStartServing && (
                <Menu.Item onClick={onStartServing}>
                  Start Serving
                </Menu.Item>
              )}
              {['waiting', 'called'].includes(entry.status) && onNoShow && (
                <Menu.Item color="red" onClick={onNoShow}>
                  Mark No-Show
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group gap="xs">
          <span style={{ fontSize: 14 }}>⏱️</span>
          <Text size="xs" c="dimmed">
            {waitTime > 0 ? `Waiting ${waitTime} min` : 'Just joined'}
          </Text>
        </Group>

        {entry.status === 'waiting' && (
          <Group gap="xs">
            <Text size="xs" c="dimmed">Position:</Text>
            <Text size="xs" fw={500}>#{entry.position}</Text>
            {entry.estimated_wait_mins && (
              <>
                <Text size="xs" c="dimmed">•</Text>
                <Text size="xs" c="dimmed">~{entry.estimated_wait_mins} min wait</Text>
              </>
            )}
          </Group>
        )}

        {entry.appointment_id && (
          <Badge size="xs" variant="outline" color="gray">
            Has Appointment
          </Badge>
        )}

        {/* Quick Action Buttons */}
        {entry.status === 'waiting' && onCall && (
          <Button 
            size="xs" 
            variant="light" 
            color="green"
            onClick={onCall}
            fullWidth
          >
            Call
          </Button>
        )}

        {entry.status === 'called' && onStartServing && (
          <Button 
            size="xs" 
            variant="filled" 
            color="teal"
            onClick={onStartServing}
            fullWidth
          >
            Start Serving
          </Button>
        )}
      </Stack>
    </Paper>
  )
}
