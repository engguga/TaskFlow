import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCalendar } from '../hooks/useCalendar';

export const CalendarCallback: React.FC = () => {
  const { handleGoogleCallback } = useCalendar();
  const navigate = useNavigate();

  useEffect(() => {
    // Mock OAuth callback handling
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code') || 'mock-auth-code';
    
    handleGoogleCallback(code);
    
    // Redirect to calendar page after a short delay
    setTimeout(() => {
      navigate('/calendar');
    }, 2000);
  }, [handleGoogleCallback, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Connecting to Google Calendar...
        </h2>
        <p className="text-gray-600">
          Please wait while we set up your calendar integration.
        </p>
      </div>
    </div>
  );
};
