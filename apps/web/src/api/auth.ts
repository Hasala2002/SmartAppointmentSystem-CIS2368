import { apiClient } from './client'
import { ApiAuthResponse, ApiUser, User } from '../types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
}

export const mapApiUser = (user: ApiUser): User => ({
  id: user.id,
  email: user.email,
  firstName: user.first_name,
  lastName: user.last_name,
  phone: user.phone ?? '',
})

export const loginRequest = async (payload: LoginPayload): Promise<ApiAuthResponse> => {
  const { data } = await apiClient.post<ApiAuthResponse>('/auth/login', payload)
  return data
}

export const registerRequest = async (
  payload: RegisterPayload
): Promise<ApiAuthResponse> => {
  const { data } = await apiClient.post<ApiAuthResponse>('/auth/register', payload)
  return data
}

export const meRequest = async (): Promise<ApiUser> => {
  const { data } = await apiClient.get<ApiUser>('/auth/me')
  return data
}
