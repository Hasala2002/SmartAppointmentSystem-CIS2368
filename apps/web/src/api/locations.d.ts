import { ApiAvailableSlotsResponse, ApiLocation } from '../types';
export declare const listLocationsRequest: () => Promise<ApiLocation[]>;
export declare const getAvailableSlotsRequest: (locationId: string, date: string) => Promise<ApiAvailableSlotsResponse>;
