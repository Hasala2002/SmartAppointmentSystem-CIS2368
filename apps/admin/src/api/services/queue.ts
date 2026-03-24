import apiClient from '../client'

export interface QueueEntry {
  id: string
  location_id: string
  customer_id: string
  appointment_id: string | null
  queue_number: string
  position: number
  estimated_wait_mins: number | null
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'left'
  joined_at: string | null
  called_at: string | null
}

export interface QueueStatus {
  location_id: string
  total_waiting: number
  currently_serving: string | null
  entries: QueueEntry[]
}

export const queueApi = {
  getStatus: async (locationId: string): Promise<QueueStatus> => {
    const response = await apiClient.get(`/queue/status/${locationId}`)
    return response.data
  },

  checkIn: async (appointmentId: string): Promise<QueueEntry> => {
    const response = await apiClient.post('/queue/check-in', {
      appointment_id: appointmentId
    })
    return response.data
  },

  callNext: async (locationId: string): Promise<QueueEntry> => {
    const response = await apiClient.post(`/queue/call-next/${locationId}`)
    return response.data
  },

  callSpecific: async (entryId: string): Promise<QueueEntry> => {
    const response = await apiClient.post(`/queue/${entryId}/call`)
    return response.data
  },

  startServing: async (entryId: string): Promise<QueueEntry> => {
    const response = await apiClient.post(`/queue/${entryId}/start-serving`)
    return response.data
  },

  complete: async (entryId: string): Promise<QueueEntry> => {
    const response = await apiClient.post(`/queue/${entryId}/complete`)
    return response.data
  },

  markNoShow: async (entryId: string): Promise<QueueEntry> => {
    const response = await apiClient.post(`/queue/${entryId}/no-show`)
    return response.data
  },
}
