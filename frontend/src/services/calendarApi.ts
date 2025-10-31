import api from './api';
import type { GoogleAuthResponse, SyncStatus, SyncToggleRequest } from '../types/calendar';

export const calendarAPI = {
  initGoogleAuth: async (userId: number): Promise<GoogleAuthResponse> => {
    const response = await api.post<GoogleAuthResponse>('/calendar/auth', { user_id: userId });
    return response.data;
  },

  handleGoogleCallback: async (code: string, userId: number): Promise<{ message: string; sync_enabled: boolean }> => {
    const response = await api.post('/calendar/callback', { code, user_id: userId });
    return response.data;
  },

  toggleCalendarSync: async (data: SyncToggleRequest): Promise<{ message: string; sync_enabled: boolean }> => {
    const response = await api.post('/calendar/sync', data);
    return response.data;
  },

  getSyncStatus: async (userId: number): Promise<SyncStatus> => {
    const response = await api.get<SyncStatus>(`/calendar/status/${userId}`);
    return response.data;
  },

  disconnectGoogle: async (userId: number): Promise<{ message: string }> => {
    const response = await api.post(`/calendar/disconnect/${userId}`);
    return response.data;
  },
};
