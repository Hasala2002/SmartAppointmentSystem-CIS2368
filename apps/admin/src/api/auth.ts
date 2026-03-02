import { apiClient } from './client'

export interface ApiUser {
  id: string
  email: string
  role: string
}

export interface ApiAuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  user: ApiUser
}

export const loginRequest = async (email: string, password: string): Promise<ApiAuthResponse> => {
  const { data } = await apiClient.post<ApiAuthResponse>('/auth/login', { email, password })
  return data
}

export const meRequest = async (): Promise<ApiUser> => {
  const { data } = await apiClient.get<ApiUser>('/auth/me')
  return data
}
