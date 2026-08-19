import { apiRequest } from './api';

export const getSubordinates = async () => {
    return apiRequest('/api/admin/subordinates');
};

export const getPendingRequests = async () => {
    return apiRequest('/api/requests/pending');
};

export const processAttendanceRequest = async (id: string, status: string) => {
    return apiRequest(`/api/requests/attendance/${id}`, {
        method: 'POST',
        body: JSON.stringify({ status })
    });
};

export const processLeaveRequest = async (id: string, status: string) => {
    return apiRequest(`/api/requests/leave/${id}`, {
        method: 'POST',
        body: JSON.stringify({ status })
    });
};
