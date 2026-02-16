import { Stack } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { People } from 'react-ionicons'

export function Queue() {
  return (
    <Stack>
      <PageHeader title="Queue Management" />
      <EmptyState
        icon={<People color="currentColor" />}
        title="Queue Management Coming Soon"
        description="Real-time queue tracking and management will be available in the next update."
      />
    </Stack>
  )
}
