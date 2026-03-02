import { Stack, Text, Button, SimpleGrid } from '@mantine/core'
import { ApiTimeSlot } from '../../types'

interface TimeSlotPickerProps {
  selectedTime?: string
  onSelect: (time: string) => void
  slots: ApiTimeSlot[]
  isLoading: boolean
}

export const TimeSlotPicker = ({ selectedTime, onSelect, slots, isLoading }: TimeSlotPickerProps) => {
  if (isLoading) {
    return <Text c="dimmed">Loading available time slots...</Text>
  }

  if (slots.length === 0) {
    return <Text c="dimmed">No available slots for this date.</Text>
  }

  return (
    <Stack gap="md">
      <Text fw={600} size="lg">
        Available Time Slots
      </Text>
      <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm">
        {slots.map((slot) => (
          <Button
            key={slot.start}
            variant={selectedTime === slot.start ? 'filled' : 'light'}
            disabled={!slot.available}
            onClick={() => onSelect(slot.start)}
            size="sm"
          >
            {slot.start}
          </Button>
        ))}
      </SimpleGrid>
    </Stack>
  )
}
