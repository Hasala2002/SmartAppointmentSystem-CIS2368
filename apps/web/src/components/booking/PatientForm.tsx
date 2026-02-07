import { Stack, Text, Group, Button, Select, Radio, Textarea } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { UseFormReturn } from 'react-hook-form'
import { PatientInfo } from '../../types'
import { faker } from '@faker-js/faker'

interface PatientFormProps {
  form: UseFormReturn<PatientInfo>
  onDemoFill: () => void
}

export const PatientForm = ({ form, onDemoFill }: PatientFormProps) => {
  const { register, setValue, watch } = form

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text fw={600} size="lg">
          Pre-Appointment Information
        </Text>
        <Button variant="light" size="xs" onClick={onDemoFill}>
          Fill with Demo Data
        </Button>
      </Group>

      {/* Date of Birth */}
      <DateInput
        label="Date of Birth"
        placeholder="Select your date of birth"
        maxDate={new Date()}
        {...register('dateOfBirth')}
      />

      {/* Insurance */}
      <Select
        label="Do you have dental insurance?"
        placeholder="Select an option"
        data={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        {...register('hasInsurance')}
      />

      {/* Last Dental Visit */}
      <Select
        label="When was your last dental visit?"
        placeholder="Select a timeframe"
        data={[
          { value: 'within-6-months', label: 'Within 6 months' },
          { value: '6-12-months', label: '6-12 months' },
          { value: 'over-a-year', label: 'Over a year' },
          { value: 'never', label: 'Never' },
        ]}
        {...register('lastDentalVisit')}
      />

      {/* Dental Pain */}
      <Radio.Group
        label="Are you currently experiencing any dental pain?"
        {...register('hasDentalPain')}
      >
        <Stack gap="sm">
          <Radio value="yes" label="Yes" />
          <Radio value="no" label="No" />
        </Stack>
      </Radio.Group>

      {/* Allergies */}
      <Textarea
        label="Do you have any allergies to medications? (Optional)"
        placeholder="List any medication allergies..."
        {...register('allergies')}
      />

      {/* Additional Notes */}
      <Textarea
        label="Any additional notes for the dentist? (Optional)"
        placeholder="Anything else the dentist should know..."
        {...register('additionalNotes')}
      />
    </Stack>
  )
}
