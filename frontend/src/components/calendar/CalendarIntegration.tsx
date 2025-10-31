import React from 'react';
import { useCalendar } from '../../hooks/useCalendar';

export const CalendarIntegration: React.FC = () => {
  const { 
    syncStatus, 
    toggleCalendarSync, 
    disconnectGoogle 
  } = useCalendar();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Calendar Integration</h3>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">
            {syncStatus === 'connected' 
              ? 'Connected to Google Calendar' 
              : syncStatus === 'connecting'
              ? 'Connecting...'
              : 'Not connected to Google Calendar'
            }
          </p>
          {syncStatus === 'connected' && (
            <p className="text-xs text-green-600 mt-1">
              Your tasks will be synced with your calendar
            </p>
          )}
        </div>
        
        <button
          onClick={syncStatus === 'connected' ? disconnectGoogle : toggleCalendarSync}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            syncStatus === 'connected'
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {syncStatus === 'connected' ? 'Disconnect' : 'Connect Google Calendar'}
        </button>
      </div>

      {syncStatus === 'connecting' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            Please complete the authentication in the popup window...
          </p>
        </div>
      )}
    </div>
  );
};
