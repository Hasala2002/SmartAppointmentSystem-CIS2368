import { Paper, Stack, Text, Button, Group, CloseButton, Alert } from '@mantine/core'
import { usePushNotifications } from '../hooks/usePushNotifications'

interface NotificationPromptProps {
  onClose?: () => void
}

export const NotificationPrompt = ({ onClose }: NotificationPromptProps) => {
  const { 
    isSupported, 
    isSubscribed, 
    isLoading, 
    permission,
    error,
    subscribe,
    sendTest 
  } = usePushNotifications()

  if (!isSupported) {
    return null
  }

  if (isSubscribed) {
    return (
      <Alert 
        color="green" 
        icon={<span style={{ fontSize: 20 }}>✓</span>}
        withCloseButton
        onClose={onClose}
      >
        <Group justify="space-between" align="center">
          <Text size="sm">Notifications enabled! You'll be notified when it's your turn.</Text>
          <Button size="xs" variant="subtle" onClick={sendTest}>
            Send Test
          </Button>
        </Group>
      </Alert>
    )
  }

  if (permission === 'denied') {
    return (
      <Alert color="orange" withCloseButton onClose={onClose}>
        <Text size="sm">
          Notifications are blocked. Please enable them in your browser settings to get queue updates.
        </Text>
      </Alert>
    )
  }

  return (
    <Paper p="md" withBorder radius="md" bg="teal.0">
      <Group justify="space-between" align="flex-start">
        <Group gap="md" align="flex-start">
          <span style={{ fontSize: 24 }}>🔔</span>
          <Stack gap="xs">
            <Text fw={500} size="sm">Enable Notifications</Text>
            <Text size="xs" c="dimmed">
              Get notified when it's your turn — even if you leave this page.
            </Text>
            {error && <Text size="xs" c="red">{error}</Text>}
          </Stack>
        </Group>
        <Group gap="xs">
          <Button 
            size="sm" 
            onClick={subscribe}
            loading={isLoading}
          >
            Enable
          </Button>
          {onClose && (
            <CloseButton onClick={onClose} />
          )}
        </Group>
      </Group>
    </Paper>
  )
}
