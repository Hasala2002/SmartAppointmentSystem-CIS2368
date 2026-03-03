import { Card, Group, Stack, Skeleton } from '@mantine/core'

export const AppointmentCardSkeleton = () => {
  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        <Group justify="space-between">
          <Stack gap={4} style={{ flex: 1 }}>
            <Skeleton height={20} width="30%" radius="md" />
            <Skeleton height={16} width="25%" radius="md" />
          </Stack>
          <Skeleton height={28} width={80} radius="md" />
        </Group>

        <Group gap="xs">
          <Skeleton circle height={18} width={18} />
          <Skeleton height={16} width="40%" radius="md" />
        </Group>

        <Skeleton height={14} width="50%" radius="md" />
      </Stack>
    </Card>
  )
}
