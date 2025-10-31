import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCalendar } from '../hooks/useCalendar';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Card, CardContent } from '../components/ui/Card';

export const CalendarCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { handleGoogleCallback } = useCalendar(user?.id || null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const state = searchParams.get('state');

      console.log('🔍 Calendar Callback Debug:');
      console.log('URL Search Params:', Object.fromEntries(searchParams.entries()));
      console.log('Code:', code);
      console.log('Error:', error);
      console.log('State:', state);
      console.log('User:', user);

      if (error) {
        setStatus('error');
        setMessage(`Google authentication failed: ${error}. State: ${state}`);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage(`No authorization code received from Google. 
          Received params: ${Object.fromEntries(searchParams.entries())}
          Check if redirect URIs match exactly in Google Console.`);
        return;
      }

      if (!user) {
        setStatus('error');
        setMessage('User not authenticated. Please login again.');
        return;
      }

      try {
        const success = await handleGoogleCallback(code);
        if (success) {
          setStatus('success');
          setMessage('Google Calendar connected successfully! Redirecting...');
          setTimeout(() => navigate('/settings'), 2000);
        } else {
          setStatus('error');
          setMessage('Failed to connect Google Calendar - backend error');
        }
      } catch (err) {
        setStatus('error');
        setMessage(`An error occurred while connecting to Google Calendar: ${err}`);
      }
    };

    processCallback();
  }, [searchParams, user, handleGoogleCallback, navigate]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Connecting to Google Calendar...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          {status === 'success' ? (
            <div className="text-green-600 dark:text-green-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Success!</h3>
            </div>
          ) : (
            <div className="text-red-600 dark:text-red-400">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold mb-2">Error</h3>
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400 mb-4 whitespace-pre-line">{message}</p>
          <button
            onClick={() => navigate('/settings')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Back to Settings
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
