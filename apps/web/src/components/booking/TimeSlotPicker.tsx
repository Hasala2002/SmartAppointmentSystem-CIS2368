import { Stack, Group, Divider, Text, Chip, Button, SimpleGrid } from '@mantine/core'

interface TimeSlotPickerProps {
  selectedTime?: string
  onSelect: (time: string) => void
  date: Date | null
}

const MORNING_SLOTS = [
  '9:00', '9:15', '9:30', '9:45', '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45',
]

const AFTERNOON_SLOTS = [
  '12:00', '12:15', '12:30', '12:45', '1:00', '1:15', '1:30', '1:45', '2:00', '2:15', '2:30', '2:45',
]

const EVENING_SLOTS = ['3:00', '3:15', '3:30', '3:45', '4:00', '4:15', '4:30', '4:45']

export const TimeSlotPicker = ({ selectedTime, onSelect, date }: TimeSlotPickerProps) => {
  // Randomly mark 20% of slots as unavailable for demo
  const isUnavailable = (slot: string) => Math.random() > 0.8

  return (
    <Stack gap="lg">
      {/* Morning Section */}
      <Stack gap="md">
        <Text fw={600} size="lg">
          Morning (9:00 AM - 12:00 PM)
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm">
          {MORNING_SLOTS.map((slot) => {
            const unavailable = isUnavailable(slot)
            return (
              <Button
                key={slot}
                variant={selectedTime === slot ? 'filled' : 'light'}
                disabled={unavailable}
                onClick={() => onSelect(slot)}
                size="sm"
                style={{
                  opacity: unavailable ? 0.5 : 1,
                }}
              >
                {slot} AM
              </Button>
            )
          })}
        </SimpleGrid>
      </Stack>

      <Divider />

      {/* Afternoon Section */}
      <Stack gap="md">
        <Text fw={600} size="lg">
          Afternoon (12:00 PM - 3:00 PM)
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm">
          {AFTERNOON_SLOTS.map((slot) => {
            const unavailable = isUnavailable(slot)
            return (
              <Button
                key={slot}
                variant={selectedTime === slot ? 'filled' : 'light'}
                disabled={unavailable}
                onClick={() => onSelect(slot)}
                size="sm"
                style={{
                  opacity: unavailable ? 0.5 : 1,
                }}
              >
                {slot} PM
              </Button>
            )
          })}
        </SimpleGrid>
      </Stack>

      <Divider />

      {/* Evening Section */}
      <Stack gap="md">
        <Text fw={600} size="lg">
          Evening (3:00 PM - 5:00 PM)
        </Text>
        <SimpleGrid cols={{ base: 2, sm: 4, md: 6 }} spacing="sm">
          {EVENING_SLOTS.map((slot) => {
            const unavailable = isUnavailable(slot)
            return (
              <Button
                key={slot}
                variant={selectedTime === slot ? 'filled' : 'light'}
                disabled={unavailable}
                onClick={() => onSelect(slot)}
                size="sm"
                style={{
                  opacity: unavailable ? 0.5 : 1,
                }}
              >
                {slot} PM
              </Button>
            )
          })}
        </SimpleGrid>
      </Stack>
    </Stack>
  )
}
