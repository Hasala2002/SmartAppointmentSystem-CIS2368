import { Paper, TextInput, PasswordInput, Button, Anchor, Center, Stack, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { User } from '../types'

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    // Create dummy user
    const user: User = {
      id: Math.random().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
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
              Create Account
            </Title>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                label="First Name"
                placeholder="John"
                error={errors.firstName?.message}
                {...register('firstName')}
              />

              <TextInput
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />

              <TextInput
                label="Email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <TextInput
                label="Phone"
                placeholder="(555) 123-4567"
                error={errors.phone?.message}
                {...register('phone')}
              />

              <PasswordInput
                label="Password"
                placeholder="Create a password"
                error={errors.password?.message}
                {...register('password')}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button fullWidth type="submit">
                Create Account
              </Button>
            </Stack>
          </form>

          <Stack gap={0}>
            <span>
              Already have an account?{' '}
              <Anchor component={RouterLink} to="/login">
                Sign in
              </Anchor>
            </span>
          </Stack>
        </Stack>
      </Paper>
    </Center>
  )
}
