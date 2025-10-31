import { useState, useEffect } from 'react';
import { Task } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      // Mock data for now since API is not fully implemented
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Complete project setup',
          description: 'Set up the full-stack project structure',
          status: 'completed',
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Implement task board',
          description: 'Create drag and drop task board',
          status: 'in_progress',
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Add user authentication',
          description: 'Implement login and registration',
          status: 'pending',
          priority: 'high',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      setTasks(mockTasks);
    } catch (err) {
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      throw err;
    }
  };

  const updateTask = async (id: string, taskData: Partial<Task>) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === id 
          ? { ...task, ...taskData, updated_at: new Date().toISOString() }
          : task
      ));
    } catch (err) {
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: loadTasks,
  };
};
