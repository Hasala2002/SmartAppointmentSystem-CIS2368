import { Stack } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { PersonAdd } from 'react-ionicons'

export function Staff() {
  return (
    <Stack>
      <PageHeader title="Staff Management" />
      <EmptyState
        icon={<PersonAdd color="currentColor" />}
        title="Staff Management Coming Soon"
        description="Team management features will be available in Sprint 2."
      />
    </Stack>
  )
}
