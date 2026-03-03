import { Stack, SimpleGrid, Skeleton } from '@mantine/core'

export const TimeSlotSkeleton = () => {
  return (
    <Stack gap="md">
      <Skeleton height={28} width="40%" radius="md" />
      <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm">
        {Array.from({ length: 12 }).map((_, idx) => (
          <Skeleton key={idx} height={40} radius="md" />
        ))}
      </SimpleGrid>
    </Stack>
  )
}
