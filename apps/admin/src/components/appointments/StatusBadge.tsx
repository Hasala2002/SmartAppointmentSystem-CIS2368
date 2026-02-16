import { Badge } from '@mantine/core'
import { AppointmentStatus } from '../../types'

const statusColorMap: Record<AppointmentStatus, string> = {
  pending: 'yellow',
  confirmed: 'blue',
  checked_in: 'cyan',
  in_progress: 'teal',
  completed: 'green',
  cancelled: 'gray',
  no_show: 'red'
}

const statusLabelMap: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show'
}

interface StatusBadgeProps {
  status: AppointmentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge color={statusColorMap[status]} variant="light">
      {statusLabelMap[status]}
    </Badge>
  )
}
