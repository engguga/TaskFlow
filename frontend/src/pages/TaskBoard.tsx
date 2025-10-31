import React, { useState } from 'react';
import { Task } from '../services/api';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  const handleDragStart = () => {
    // Implement drag logic here
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
      draggable
      onDragStart={handleDragStart}
    >
      {children}
    </div>
  );
};

export const TaskBoard: React.FC = () => {
  const { tasks, createTask } = useTasks();
  const [showForm, setShowForm] = useState(false);

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await createTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const columns = [
    { id: 'pending', title: 'Pending', tasks: tasks.filter(t => t.status === 'pending') },
    { id: 'in_progress', title: 'In Progress', tasks: tasks.filter(t => t.status === 'in_progress') },
    { id: 'completed', title: 'Completed', tasks: tasks.filter(t => t.status === 'completed') },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Task Board</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            New Task
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <div key={column.id} className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
              <div className="space-y-4">
                {column.tasks.map(task => (
                  <Card key={task.id}>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                  </Card>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
