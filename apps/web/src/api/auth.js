import { apiClient } from './client';
export const mapApiUser = (user) => ({
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone ?? '',
});
export const loginRequest = async (payload) => {
    const { data } = await apiClient.post('/auth/login', payload);
    return data;
};
export const registerRequest = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload);
    return data;
};
export const meRequest = async () => {
    const { data } = await apiClient.get('/auth/me');
    return data;
};
