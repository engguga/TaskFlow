import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useTasks } from '../hooks/useTasks';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { DashboardStatsSkeleton, CardSkeleton } from '../components/ui/Skeleton';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { tasks, loading } = useTasks();
  const navigate = useNavigate();

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DashboardStatsSkeleton />
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Tasks</h2>
            <Button disabled>View All Tasks</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
                </h3>
                <div className="space-y-3">
                  {[...Array(3)].map((_, taskIndex) => (
                    <CardSkeleton key={taskIndex} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pendingTasks.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Pending Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{inProgressTasks.length}</div>
              <div className="text-gray-600 dark:text-gray-400">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{completedTasks.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">{overdueTasks.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Overdue</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Tasks</h2>
          <Button onClick={() => navigate('/tasks')}>
            View All Tasks
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Pending ({pendingTasks.length})</h3>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map(task => (
                <Card key={task.id} className={
                  task.due_date && new Date(task.due_date) < new Date() ? 'border-l-4 border-l-red-500' : ''
                }>
                  <CardContent className="py-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className={`text-xs ${
                          new Date(task.due_date) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">In Progress ({inProgressTasks.length})</h3>
            <div className="space-y-3">
              {inProgressTasks.slice(0, 5).map(task => (
                <Card key={task.id} className={
                  task.due_date && new Date(task.due_date) < new Date() ? 'border-l-4 border-l-red-500' : ''
                }>
                  <CardContent className="py-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                      {task.due_date && (
                        <span className={`text-xs ${
                          new Date(task.due_date) < new Date() ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(task.due_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">Completed ({completedTasks.length})</h3>
            <div className="space-y-3">
              {completedTasks.slice(0, 5).map(task => (
                <Card key={task.id}>
                  <CardContent className="py-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' :
                        task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' :
                        'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
