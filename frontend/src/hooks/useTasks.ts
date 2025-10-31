import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import { useToast } from './useToast';
import { validateTaskTitle, validateDueDate } from '../utils/validation';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { success, error: showError, info } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const tasksData = await tasksAPI.getTasks();
      setTasks(tasksData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch tasks';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateTask = (taskData: CreateTaskRequest): boolean => {
    const titleValidation = validateTaskTitle(taskData.title);
    
    if (!titleValidation.isValid) {
      showError(titleValidation.errors[0]);
      return false;
    }

    if (taskData.due_date) {
      const dueDateValidation = validateDueDate(taskData.due_date);
      if (!dueDateValidation.isValid) {
        showError(dueDateValidation.errors[0]);
        return false;
      }
    }

    return true;
  };

  const createTask = async (taskData: CreateTaskRequest): Promise<boolean> => {
    if (!validateTask(taskData)) return false;
    
    setError(null);
    try {
      const newTask = await tasksAPI.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      success('Task created successfully!');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to create task';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    }
  };

  const updateTask = async (id: number, taskData: UpdateTaskRequest): Promise<boolean> => {
    if (taskData.title && !validateTaskTitle(taskData.title).isValid) {
      showError(validateTaskTitle(taskData.title).errors[0]);
      return false;
    }

    if (taskData.due_date) {
      const dueDateValidation = validateDueDate(taskData.due_date);
      if (!dueDateValidation.isValid) {
        showError(dueDateValidation.errors[0]);
        return false;
      }
    }

    setError(null);
    try {
      const updatedTask = await tasksAPI.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      success('Task updated successfully!');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update task';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    }
  };

  const deleteTask = async (id: number): Promise<boolean> => {
    setDeletingId(id);
    setError(null);
    try {
      await tasksAPI.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      success('Task deleted successfully!');
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to delete task';
      setError(errorMessage);
      showError(errorMessage);
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const updateTaskStatus = async (id: number, status: string): Promise<boolean> => {
    try {
      const updatedTask = await tasksAPI.updateTask(id, { status });
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      info(`Task moved to ${status.replace('_', ' ')}`);
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to update task status';
      showError(errorMessage);
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    deletingId,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
};
