import axios from 'axios'

// API base URL is baked in at build time via VITE_API_URL (passed as a Docker
// build arg from docker-compose.local.yml so it tracks API_PORT). The fallback
// keeps mobile testing on the LAN working when the API is on the host's
// current address.
const apiBaseURL =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}:8001/api/v1`

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
