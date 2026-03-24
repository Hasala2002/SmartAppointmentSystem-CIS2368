import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Modal, Stack, Text, Group } from '@mantine/core'
import { apiClient } from '../api/client'

interface CheckInButtonProps {
  appointmentId: string
  appointmentTime: string
  disabled?: boolean
}

export const CheckInButton = ({ appointmentId, appointmentTime, disabled }: CheckInButtonProps) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await apiClient.post('/queue/check-in', {
        appointment_id: appointmentId
      })
      setShowModal(false)
      navigate('/queue')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to check in')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        disabled={disabled}
      >
        Check In
      </Button>

      <Modal
        opened={showModal}
        onClose={() => setShowModal(false)}
        title="Check In for Appointment"
        centered
      >
        <Stack gap="md">
          <Text>
            Ready to check in for your {appointmentTime} appointment?
          </Text>
          <Text size="sm" c="dimmed">
            You'll be added to the queue and notified when it's your turn.
          </Text>

          {error && (
            <Text c="red" size="sm">{error}</Text>
          )}

          <Group justify="flex-end">
            <Button variant="light" onClick={() => setShowModal(false)}>
              Not Yet
            </Button>
            <Button onClick={handleCheckIn} loading={isLoading}>
              Check In Now
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  )
}
