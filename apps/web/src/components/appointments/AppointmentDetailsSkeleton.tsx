import { Container, Stack, Paper, Group, Skeleton, Button } from '@mantine/core'

export const AppointmentDetailsSkeleton = () => {
  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Button variant="subtle" disabled>
          ← Back to Dashboard
        </Button>

        <Paper p="lg" radius="md" withBorder>
          <Group justify="space--between" mb="md">
            <Skeleton height={32} width="40%" radius="md" />
            <Skeleton height={28} width={100} radius="md" />
          </Group>

          <Stack gap="md">
            <Group gap="xs">
              <Skeleton circle height={24} width={24} />
              <Stack gap={4} style={{ flex: 1 }}>
                <Skeleton height={20} width="30%" radius="md" />
                <Skeleton height={14} width="25%" radius="md" />
              </Stack>
            </Group>

            <Group gap="xs">
              <Skeleton circle height={24} width={24} />
              <Stack gap={4} style={{ flex: 1 }}>
                <Skeleton height={20} width="40%" radius="md" />
                <Skeleton height={14} width="50%" radius="md" />
              </Stack>
            </Group>
          </Stack>
        </Paper>

        <Group gap="md">
          <Skeleton height={40} width={150} radius="md" />
          <Skeleton height={40} width={180} radius="md" />
        </Group>
      </Stack>
    </Container>
  )
}
