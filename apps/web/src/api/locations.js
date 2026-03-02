import { apiClient } from './client';
export const listLocationsRequest = async () => {
    const { data } = await apiClient.get('/locations/');
    return data;
};
export const getAvailableSlotsRequest = async (locationId, date) => {
    const { data } = await apiClient.get('/availability/bookable-slots', {
        params: { location_id: locationId, date },
    });
    return data;
};
