import { Stack, Paper, Group, Grid, Skeleton, Button, Title } from '@mantine/core'

export const AppointmentDetailsSkeleton = () => {
  return (
    <Stack gap="lg">
      {/* Back Button */}
      <Button variant="subtle" disabled>
        ← Back to Appointments
      </Button>

      {/* Header */}
      <Group justify="space-between" align="flex-start">
        <Stack gap={0}>
          <Skeleton height={28} width="30%" radius="md" />
          <Skeleton height={14} width="40%" radius="md" style={{ marginTop: 8 }} />
        </Stack>
        <Skeleton height={28} width={100} radius="md" />
      </Group>

      {/* Main Content Grid */}
      <Grid>
        {/* Left Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {/* Appointment Info */}
          <Paper p="md" radius="md" withBorder mb="md">
            <Skeleton height={20} width="40%" radius="md" mb="md" />
            <Stack gap="xs">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Group key={idx} justify="space-between">
                  <Skeleton height={14} width="30%" radius="md" />
                  <Skeleton height={14} width="40%" radius="md" />
                </Group>
              ))}
            </Stack>
          </Paper>

          {/* Patient Info */}
          <Paper p="md" radius="md" withBorder>
            <Skeleton height={20} width="40%" radius="md" mb="md" />
            <Stack gap="xs">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Group key={idx} justify="space-between">
                  <Skeleton height={14} width="30%" radius="md" />
                  <Skeleton height={14} width="40%" radius="md" />
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        {/* Right Column */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          {/* Form Responses */}
          <Paper p="md" radius="md" withBorder mb="md">
            <Skeleton height={20} width="40%" radius="md" mb="md" />
            <Stack gap="xs">
              {Array.from({ length: 4 }).map((_, idx) => (
                <Group key={idx} justify="space-between">
                  <Skeleton height={14} width="30%" radius="md" />
                  <Skeleton height={14} width="40%" radius="md" />
                </Group>
              ))}
            </Stack>
          </Paper>

          {/* Timeline */}
          <Paper p="md" radius="md" withBorder>
            <Skeleton height={20} width="40%" radius="md" mb="md" />
            <Stack gap="md">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Group key={idx} gap="sm" align="flex-start">
                  <Skeleton circle height={24} width={24} />
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Skeleton height={14} width="50%" radius="md" />
                    <Skeleton height={12} width="60%" radius="md" />
                  </Stack>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      {/* Action Buttons */}
      <Group>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} height={40} width={120} radius="md" />
        ))}
      </Group>
    </Stack>
  )
}
