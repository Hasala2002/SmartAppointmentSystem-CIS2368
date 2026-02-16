import { Stack } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { Location } from 'react-ionicons'

export function Locations() {
  return (
    <Stack>
      <PageHeader title="Locations" />
      <EmptyState
        icon={<Location color="currentColor" />}
        title="Location Management Coming Soon"
        description="Location management features will be available in a future sprint."
      />
    </Stack>
  )
}
