import { Center, Paper, Stack, PasswordInput, Button, Title, Text, ThemeIcon, List } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Checkmark } from 'react-ionicons'

const ResetPassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({})
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { password?: string; confirmPassword?: string } = {}

    if (!password || password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log('Password reset:', password)
    setSubmitted(true)
  }

  return (
    <Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-9)' }}>
      <Paper p="xl" radius="lg" style={{ width: '100%', maxWidth: 420 }}>
        {!submitted ? (
          <Stack gap="lg">
            <Stack gap={0}>
              <Title order={2}>Create New Password</Title>
              <Text c="dimmed" size="sm">
                Enter a new password for your account
              </Text>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack gap="md">
                <PasswordInput
                  label="New Password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  error={errors.password}
                />

                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                  error={errors.confirmPassword}
                />

                <Stack gap="xs">
                  <Text size="xs" fw={500} c="dimmed">
                    Password requirements:
                  </Text>
                  <List size="xs" c="dimmed">
                    <List.Item>At least 8 characters</List.Item>
                    <List.Item>Passwords must match</List.Item>
                  </List>
                </Stack>

                <Button type="submit" fullWidth color="teal" size="md">
                  Reset Password
                </Button>
              </Stack>
            </form>
          </Stack>
        ) : (
          <Stack gap="lg" align="center">
            <ThemeIcon size={80} radius="xl" color="teal" variant="light">
              <Checkmark size="48px" />
            </ThemeIcon>

            <Stack gap={0} style={{ textAlign: 'center' }}>
              <Title order={3}>Password Reset Successful</Title>
              <Text c="dimmed" size="sm">
                Your password has been successfully reset. You can now sign in with your new password.
              </Text>
            </Stack>

            <Button
              component="button"
              type="button"
              fullWidth
              color="teal"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </Button>
          </Stack>
        )}
      </Paper>
    </Center>
  )
}

export { ResetPassword }
