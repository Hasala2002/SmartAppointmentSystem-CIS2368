import axios from 'axios';
export const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use((config) => {
    const raw = localStorage.getItem('auth-store');
    if (!raw)
        return config;
    try {
        const parsed = JSON.parse(raw);
        const token = parsed.state?.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    catch {
        // ignore malformed persisted state
    }
    return config;
});
