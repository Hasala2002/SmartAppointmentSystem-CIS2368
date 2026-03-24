import apiClient from '../client'

export interface Location {
  id: string
  name: string
  slug: string
  address: string | null
  city: string | null
  state: string | null
  zip_code: string | null
  phone: string | null
  timezone: string
  appointment_duration_mins: number
  buffer_mins: number
  is_active: boolean
}

export const locationsApi = {
  list: async (): Promise<Location[]> => {
    const response = await apiClient.get('/locations')
    return response.data
  },

  get: async (id: string): Promise<Location> => {
    const response = await apiClient.get(`/locations/${id}`)
    return response.data
  },
}
