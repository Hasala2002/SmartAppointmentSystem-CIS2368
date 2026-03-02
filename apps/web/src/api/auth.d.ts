import { ApiAuthResponse, ApiUser, User } from '../types';
interface LoginPayload {
    email: string;
    password: string;
}
interface RegisterPayload {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
}
export declare const mapApiUser: (user: ApiUser) => User;
export declare const loginRequest: (payload: LoginPayload) => Promise<ApiAuthResponse>;
export declare const registerRequest: (payload: RegisterPayload) => Promise<ApiAuthResponse>;
export declare const meRequest: () => Promise<ApiUser>;
export {};
