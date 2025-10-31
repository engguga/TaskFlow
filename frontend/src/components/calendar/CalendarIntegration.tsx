import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';

export const CalendarIntegration: React.FC = () => {
  const { user } = useAuthStore();
  const { syncStatus, loading, initGoogleAuth, toggleCalendarSync, disconnectGoogle } = useCalendar(user?.id || null);

  const handleConnectGoogle = async () => {
    const authUrl = await initGoogleAuth();
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const handleToggleSync = async (enable: boolean) => {
    await toggleCalendarSync(enable);
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect Google Calendar? This will remove all calendar integrations.')) {
      await disconnectGoogle();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Google Calendar Integration
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">Connection Status</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {syncStatus?.google_connected ? 'Connected to Google' : 'Not connected'}
            </p>
          </div>
          {!syncStatus?.google_connected ? (
            <Button
              onClick={handleConnectGoogle}
              loading={loading}
              variant="primary"
            >
              Connect Google Calendar
            </Button>
          ) : (
            <Button
              onClick={handleDisconnect}
              loading={loading}
              variant="danger"
            >
              Disconnect
            </Button>
          )}
        </div>

        {syncStatus?.google_connected && (
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">Calendar Sync</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {syncStatus?.calendar_sync ? 'Sync enabled' : 'Sync disabled'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleToggleSync(!syncStatus.calendar_sync)}
                loading={loading}
                variant={syncStatus.calendar_sync ? 'secondary' : 'primary'}
                size="sm"
              >
                {syncStatus.calendar_sync ? 'Disable Sync' : 'Enable Sync'}
              </Button>
            </div>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">How it works:</h5>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Tasks with due dates are automatically synced to Google Calendar</li>
            <li>• Updates to tasks are reflected in your calendar</li>
            <li>• Completed tasks are automatically removed from calendar</li>
            <li>• You'll receive calendar notifications for upcoming tasks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
