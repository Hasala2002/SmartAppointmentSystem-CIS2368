import { Paper, TextInput, PasswordInput, Button, Anchor, Center, Stack, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loginRequest, mapApiUser } from '../api/auth'
import { useState } from 'react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const response = await loginRequest({
        email: data.email,
        password: data.password,
      })
      const user = mapApiUser(response.user)
      login(user, response.access_token, response.refresh_token)
      navigate('/dashboard')
    } catch {
      setSubmitError('Unable to sign in. Please verify your credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Center style={{ minHeight: 'calc(100vh - 120px)' }}>
      <Paper p="lg" radius="md" withBorder style={{ width: '100%', maxWidth: 400 }}>
        <Stack gap="lg">
          <div>
            <Title order={2} mb="xs">
              Sign In
            </Title>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                label="Email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <PasswordInput
                label="Password"
                placeholder="Your password"
                error={errors.password?.message}
                {...register('password')}
              />

              <Button fullWidth type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
              {submitError && <span style={{ color: 'var(--mantine-color-red-6)' }}>{submitError}</span>}
            </Stack>
          </form>

          <Stack gap={0}>
            <span>
              Don't have an account?{' '}
              <Anchor component={RouterLink} to="/register">
                Sign up
              </Anchor>
            </span>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  )
}
