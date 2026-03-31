import axios from 'axios'

// Support ngrok URL via environment variable, otherwise use current host
const apiBaseURL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`

export const apiClient = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-store')
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
