import React from 'react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  // Removidas variáveis não utilizadas

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/tasks"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800">Task Board</h2>
                <p className="text-gray-600 mt-2">Manage your tasks with drag and drop</p>
              </Link>

              <Link
                to="/calendar"
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h2 className="text-xl font-semibold text-gray-800">Calendar</h2>
                <p className="text-gray-600 mt-2">View tasks in calendar format</p>
              </Link>

              <div className="block p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
                <p className="text-gray-600 mt-2">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
