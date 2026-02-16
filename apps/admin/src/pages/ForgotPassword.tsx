import { Center, Paper, Stack, TextInput, Button, Title, Text, Group, ThemeIcon } from '@mantine/core'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowBack, Checkmark } from 'react-ionicons'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email address')
      return
    }
    console.log('Password reset requested for:', email)
    setSubmitted(true)
  }

  return (
    <Center style={{ minHeight: '100vh', backgroundColor: 'var(--mantine-color-gray-9)' }}>
      <Paper p="xl" radius="lg" style={{ width: '100%', maxWidth: 420 }}>
        {!submitted ? (
          <Stack gap="lg">
            <Group mb="sm">
              <Button
                variant="subtle"
                c="teal"
                size="xs"
                leftSection={<ArrowBack size="16px" />}
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </Group>

            <Stack gap={0}>
              <Title order={2}>Reset Password</Title>
              <Text c="dimmed" size="sm">
                Enter your email and we'll send you a reset link
              </Text>
            </Stack>

            <form onSubmit={onSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Email Address"
                  placeholder="admin@smiledental.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  error={error}
                />

                <Button type="submit" fullWidth color="teal" size="md">
                  Send Reset Link
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
              <Title order={3}>Check your email</Title>
              <Text c="dimmed" size="sm">
                We've sent a password reset link to your email address. Follow the link to create a new password.
              </Text>
            </Stack>

            <Button
              component="button"
              type="button"
              fullWidth
              color="teal"
              variant="light"
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

export { ForgotPassword }
