import { Stack, Text, Group, Button, Select, Radio, Textarea } from '@mantine/core'
import { UseFormReturn } from 'react-hook-form'
import { PatientInfo } from '../../types'

interface PatientFormProps {
  form: UseFormReturn<Partial<PatientInfo>>
  onDemoFill: () => void
}

export const PatientForm = ({ form, onDemoFill }: PatientFormProps) => {
  const insurance = form.watch('dentalInsuranceStatus')
  const lastDentalVisit = form.watch('lastDentalVisit')
  const hasDentalPain = form.watch('hasDentalPain')

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


      <Select
        label="Is your recorded dental insurance the same as last time?"
        placeholder="Select an option"
        data={[
          { value: 'same_as_last', label: 'Yes, same as last time' },
          { value: 'changed', label: 'No, it changed' },
          { value: 'no_insurance', label: "I don't have dental insurance" },
        ]}
        value={insurance}
        onChange={(value) =>
          form.setValue('dentalInsuranceStatus', (value as PatientInfo['dentalInsuranceStatus']) ?? 'same_as_last')
        }
      />

      <Select
        label="When was your last dental visit?"
        placeholder="Select a timeframe"
        data={[
          { value: 'within-6-months', label: 'Within 6 months' },
          { value: '6-12-months', label: '6-12 months' },
          { value: 'over-a-year', label: 'Over a year' },
          { value: 'never', label: 'Never' },
        ]}
        value={lastDentalVisit}
        onChange={(value) =>
          form.setValue('lastDentalVisit', (value as PatientInfo['lastDentalVisit']) ?? 'never')
        }
      />

      <Radio.Group
        label="Are you currently experiencing any dental pain?"
        value={hasDentalPain ? 'true' : 'false'}
        onChange={(value) => form.setValue('hasDentalPain', value === 'true')}
      >
        <Stack gap="sm">
          <Radio value="true" label="Yes" />
          <Radio value="false" label="No" />
        </Stack>
      </Radio.Group>

      <Textarea
        label="Do you have any allergies to medications? (Optional)"
        placeholder="List any medication allergies..."
        value={form.watch('allergies') ?? ''}
        onChange={(e) => form.setValue('allergies', e.currentTarget.value)}
      />

      <Textarea
        label="Any additional notes for the dentist? (Optional)"
        placeholder="Anything else the dentist should know..."
        value={form.watch('additionalNotes') ?? ''}
        onChange={(e) => form.setValue('additionalNotes', e.currentTarget.value)}
      />
    </Stack>
  )
}
