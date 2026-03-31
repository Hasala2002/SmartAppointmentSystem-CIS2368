import axios from 'axios'

// Use current host for API calls to support mobile testing
const apiHost = window.location.hostname
const apiBaseURL = `http://${apiHost}:8000/api/v1`

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('admin-auth-store')
  if (!raw) return config

  try {
    const parsed = JSON.parse(raw) as {
      state?: { accessToken?: string | null }
    }
    const token = parsed.state?.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // ignore malformed persisted state
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
)

export default apiClient
