import { Paper, TextInput, PasswordInput, Button, Anchor, Center, Stack, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User } from '../types'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    // Create dummy user
    const user: User = {
      id: '1',
      email: data.email,
      firstName: data.email.split('@')[0],
      lastName: 'User',
      phone: '(555) 123-4567',
    }
    
    login(user)
    navigate('/dashboard')
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

              <Button fullWidth type="submit">
                Sign In
              </Button>
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
