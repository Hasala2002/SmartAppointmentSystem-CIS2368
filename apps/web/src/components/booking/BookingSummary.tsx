import { Paper, Stack, Group, Text, Anchor, Divider } from '@mantine/core'
import { PatientInfo } from '../../types'

interface BookingSummaryProps {
  locationName: string
  locationAddress: string
  date: string
  time: string
  patientInfo: PatientInfo
  onEdit: (step: number) => void
}

const VISIT_OPTIONS = {
  'within-6-months': 'Within 6 months',
  '6-12-months': '6-12 months',
  'over-a-year': 'Over a year',
  'never': 'Never',
}

export const BookingSummary = ({
  locationName,
  locationAddress,
  date,
  time,
  patientInfo,
  onEdit,
}: BookingSummaryProps) => {
  return (
    <Stack gap="lg">
      {/* Location Section */}
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">
            Location
          </Text>
          <Anchor onClick={() => onEdit(1)} size="sm">
            Edit
          </Anchor>
        </Group>
        <Stack gap="xs">
          <Text>{locationName}</Text>
          <Text size="sm" c="dimmed">
            {locationAddress}
          </Text>
        </Stack>
      </Paper>

      {/* Date & Time Section */}
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">
            Date & Time
          </Text>
          <Anchor onClick={() => onEdit(2)} size="sm">
            Edit
          </Anchor>
        </Group>
        <Stack gap="xs">
          <Text>
            <strong>Date:</strong> {date}
          </Text>
          <Text>
            <strong>Time:</strong> {time}
          </Text>
        </Stack>
      </Paper>

      {/* Patient Info Section */}
      <Paper p="lg" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Text fw={600} size="lg">
            Patient Information
          </Text>
          <Anchor onClick={() => onEdit(3)} size="sm">
            Edit
          </Anchor>
        </Group>
        <Stack gap="xs">
          <Group>
            <Text fw={500} w="50%">
              Date of Birth:
            </Text>
            <Text>{patientInfo.dateOfBirth}</Text>
          </Group>
          <Divider />
          <Group>
            <Text fw={500} w="50%">
              Dental Insurance:
            </Text>
            <Text>{patientInfo.hasInsurance === 'yes' ? 'Yes' : 'No'}</Text>
          </Group>
          <Divider />
          <Group>
            <Text fw={500} w="50%">
              Last Dental Visit:
            </Text>
            <Text>{VISIT_OPTIONS[patientInfo.lastDentalVisit]}</Text>
          </Group>
          <Divider />
          <Group>
            <Text fw={500} w="50%">
              Dental Pain:
            </Text>
            <Text>{patientInfo.hasDentalPain === 'yes' ? 'Yes' : 'No'}</Text>
          </Group>
          {patientInfo.allergies && (
            <>
              <Divider />
              <Group>
                <Text fw={500} w="50%">
                  Allergies:
                </Text>
                <Text>{patientInfo.allergies}</Text>
              </Group>
            </>
          )}
          {patientInfo.additionalNotes && (
            <>
              <Divider />
              <Group>
                <Text fw={500} w="50%">
                  Additional Notes:
                </Text>
                <Text>{patientInfo.additionalNotes}</Text>
              </Group>
            </>
          )}
        </Stack>
      </Paper>
    </Stack>
  )
}
