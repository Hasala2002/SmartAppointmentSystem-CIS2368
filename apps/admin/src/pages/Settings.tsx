import { Stack } from '@mantine/core'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { Settings as SettingsIcon } from 'react-ionicons'

export function Settings() {
  return (
    <Stack>
      <PageHeader title="Settings" />
      <EmptyState
        icon={<SettingsIcon color="currentColor" />}
        title="Settings Coming Soon"
        description="Admin settings and configuration will be available in a future sprint."
      />
    </Stack>
  )
}
