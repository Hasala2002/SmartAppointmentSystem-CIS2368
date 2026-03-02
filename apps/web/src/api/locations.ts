import { apiClient } from './client'
import { ApiAvailableSlotsResponse, ApiLocation } from '../types'

export const listLocationsRequest = async (): Promise<ApiLocation[]> => {
  const { data } = await apiClient.get<ApiLocation[]>('/locations/')
  return data
}

export const getAvailableSlotsRequest = async (
  locationId: string,
  date: string
): Promise<ApiAvailableSlotsResponse> => {
  const { data } = await apiClient.get<ApiAvailableSlotsResponse>('/availability/bookable-slots', {
    params: { location_id: locationId, date },
  })
  return data
}
