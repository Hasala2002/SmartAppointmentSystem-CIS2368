import axios from 'axios'

export const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Placeholder for future request/response interceptors
apiClient.interceptors.request.use((config) => {
  // Add auth token in the future
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally in the future
    return Promise.reject(error)
  }
)

export default apiClient
