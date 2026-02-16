import { Paper, Group, Stack, Text, ThemeIcon, SimpleGrid } from '@mantine/core'
import { ReactNode } from 'react'

interface StatsCardProps {
  icon: ReactNode
  value: string | number
  label: string
  trend?: {
    value: number
    positive: boolean
  }
}

export function StatsCard({ icon, value, label, trend }: StatsCardProps) {
  return (
    <Paper p="md" radius="md" withBorder style={{ flex: 1 }}>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Text size="sm" c="dimmed" fw={500}>
            {label}
          </Text>
          <Group align="flex-end" gap="xs">
            <Text size="xl" fw={700}>
              {value}
            </Text>
            {trend && (
              <Text size="sm" c={trend.positive ? 'green' : 'red'} fw={500}>
                {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </Text>
            )}
          </Group>
        </Stack>
        <ThemeIcon size={45} radius="md" variant="light" color="teal">
          {icon}
        </ThemeIcon>
      </Group>
    </Paper>
  )
}

export function StatsCardRow({ cards }: { cards: StatsCardProps[] }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      {cards.map((card, idx) => (
        <StatsCard key={idx} {...card} />
      ))}
    </SimpleGrid>
  )
}
