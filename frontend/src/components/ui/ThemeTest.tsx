import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeTest: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="p-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors">
      <h1 className="text-2xl font-bold mb-4">Theme Test</h1>
      <div className="space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p>Current theme: <strong>{theme}</strong></p>
          <p>HTML classes: <code>{document.documentElement.className}</code></p>
          <p>LocalStorage: <code>{localStorage.getItem('theme')}</code></p>
        </div>
        
        <button
          onClick={toggleTheme}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Toggle Theme
        </button>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-red-100 dark:bg-red-900 rounded">
            <p className="text-red-800 dark:text-red-200">Red Box - Should change</p>
          </div>
          <div className="p-4 bg-green-100 dark:bg-green-900 rounded">
            <p className="text-green-800 dark:text-green-200">Green Box - Should change</p>
          </div>
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded">
            <p className="text-yellow-800 dark:text-yellow-200">Yellow Box - Should change</p>
          </div>
          <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded">
            <p className="text-blue-800 dark:text-blue-200">Blue Box - Should change</p>
          </div>
        </div>
      </div>
    </div>
  );
};
