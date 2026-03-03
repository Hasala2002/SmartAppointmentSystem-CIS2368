import { Stack, Text, Button, SimpleGrid, Divider } from '@mantine/core'
import { ApiTimeSlot } from '../../types'
import { TimeSlotSkeleton } from './TimeSlotSkeleton'

interface TimeSlotPickerProps {
  selectedTime?: string
  onSelect: (time: string) => void
  slotsByTime: { morning: ApiTimeSlot[]; afternoon: ApiTimeSlot[]; evening: ApiTimeSlot[] }
  isLoading: boolean
}

export const TimeSlotPicker = ({ selectedTime, onSelect, slotsByTime, isLoading }: TimeSlotPickerProps) => {
  if (isLoading) {
    return <TimeSlotSkeleton />
  }

  const hasAnySlots = slotsByTime.morning.length > 0 || slotsByTime.afternoon.length > 0 || slotsByTime.evening.length > 0

  if (!hasAnySlots) {
    return <Text c="dimmed">No available slots for this date.</Text>
  }

  const renderShiftSection = (title: string, slots: ApiTimeSlot[]) => {
    if (slots.length === 0) return null

    return (
      <div key={title}>
        <Text fw={600} size="sm" c="dimmed" mb="xs">
          {title}
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm" mb="md">
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
      </div>
    )
  }

  return (
    <Stack gap="md">
      <Text fw={600} size="lg">
        Available Time Slots
      </Text>
      {renderShiftSection('Morning (6:00 AM - 12:00 PM)', slotsByTime.morning)}
      {slotsByTime.afternoon.length > 0 && slotsByTime.morning.length > 0 && <Divider />}
      {renderShiftSection('Afternoon (12:00 PM - 5:00 PM)', slotsByTime.afternoon)}
      {slotsByTime.evening.length > 0 && (slotsByTime.morning.length > 0 || slotsByTime.afternoon.length > 0) && <Divider />}
      {renderShiftSection('Evening (5:00 PM - 9:00 PM)', slotsByTime.evening)}
    </Stack>
  )
}
