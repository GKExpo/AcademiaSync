import { apiRequest } from './api';

export const login = (email: string, password: string) => {
    return apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = (data: any) => {
    return apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
