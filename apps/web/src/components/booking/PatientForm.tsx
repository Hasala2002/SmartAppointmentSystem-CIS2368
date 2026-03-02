import { Stack, Text, Group, Button, Select, Radio, Textarea } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { UseFormReturn } from 'react-hook-form'
import { PatientInfo } from '../../types'
import dayjs from 'dayjs'

interface PatientFormProps {
  form: UseFormReturn<Partial<PatientInfo>>
  onDemoFill: () => void
}

export const PatientForm = ({ form, onDemoFill }: PatientFormProps) => {
  const insurance = form.watch('hasInsurance')
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

      <DateInput
        label="Date of Birth"
        placeholder="Select your date of birth"
        maxDate={new Date()}
        value={form.watch('dateOfBirth') ? dayjs(form.watch('dateOfBirth')).toDate() : null}
        onChange={(date) => form.setValue('dateOfBirth', date ? dayjs(date).format('YYYY-MM-DD') : '')}
      />

      <Select
        label="Do you have dental insurance?"
        placeholder="Select an option"
        data={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
        value={insurance}
        onChange={(value) => form.setValue('hasInsurance', (value as PatientInfo['hasInsurance']) ?? 'no')}
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
        value={hasDentalPain}
        onChange={(value) => form.setValue('hasDentalPain', value as PatientInfo['hasDentalPain'])}
      >
        <Stack gap="sm">
          <Radio value="yes" label="Yes" />
          <Radio value="no" label="No" />
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
