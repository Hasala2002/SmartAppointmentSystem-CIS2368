import { Center, Stack, ThemeIcon, Title, Text, Button } from '@mantine/core'
import { ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Center style={{ minHeight: 300 }}>
      <Stack align="center" gap="lg">
        <ThemeIcon size={80} radius="md" variant="light" color="gray">
          {icon}
        </ThemeIcon>
        <Stack gap={0} align="center">
          <Title order={3}>{title}</Title>
          <Text size="sm" c="dimmed" ta="center" maw={300}>
            {description}
          </Text>
        </Stack>
        {action && (
          <Button onClick={action.onClick} mt="sm">
            {action.label}
          </Button>
        )}
      </Stack>
    </Center>
  )
}
