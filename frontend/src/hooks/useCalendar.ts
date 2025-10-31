import { useState, useEffect } from 'react';
import { useToast } from './useToast';
import { calendarAPI } from '../services/calendarApi';
import type { SyncStatus } from '../types/calendar';

export const useCalendar = (userId: number | null) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  const loadSyncStatus = async () => {
    if (!userId) return;
    
    try {
      const status = await calendarAPI.getSyncStatus(userId);
      setSyncStatus(status);
    } catch (err: any) {
      console.error('Failed to load calendar sync status:', err);
    }
  };

  const initGoogleAuth = async (): Promise<string | null> => {
    if (!userId) return null;
    
    setLoading(true);
    try {
      const response = await calendarAPI.initGoogleAuth(userId);
      return response.auth_url;
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to initialize Google authentication');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = async (code: string): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      await calendarAPI.handleGoogleCallback(code, userId);
      await loadSyncStatus();
      success('Google Calendar connected successfully!');
      return true;
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to connect Google Calendar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const toggleCalendarSync = async (enable: boolean): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      await calendarAPI.toggleCalendarSync({ user_id: userId, enable });
      await loadSyncStatus();
      success(enable ? 'Calendar sync enabled!' : 'Calendar sync disabled!');
      return true;
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to update calendar sync');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disconnectGoogle = async (): Promise<boolean> => {
    if (!userId) return false;
    
    setLoading(true);
    try {
      await calendarAPI.disconnectGoogle(userId);
      await loadSyncStatus();
      success('Google Calendar disconnected successfully!');
      return true;
    } catch (err: any) {
      showError(err.response?.data?.error || 'Failed to disconnect Google Calendar');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSyncStatus();
    }
  }, [userId]);

  return {
    syncStatus,
    loading,
    initGoogleAuth,
    handleGoogleCallback,
    toggleCalendarSync,
    disconnectGoogle,
    refreshStatus: loadSyncStatus,
  };
};
