import { Card, Stack, Skeleton, Group } from '@mantine/core'

export const LocationCardSkeleton = () => {
  return (
    <Card padding="lg" radius="md" withBorder>
      <Stack gap="sm">
        <Group gap="xs">
          <Skeleton circle height={20} width={20} />
          <Skeleton height={20} width="40%" radius="md" />
        </Group>
        <Stack gap={4}>
          <Skeleton height={16} width="90%" radius="md" />
          <Skeleton height={16} width="85%" radius="md" />
          <Skeleton height={16} width="60%" radius="md" />
        </Stack>
        <Skeleton height={40} radius="md" />
      </Stack>
    </Card>
  )
}
