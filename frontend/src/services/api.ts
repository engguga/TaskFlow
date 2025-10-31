import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const taskService = {
  getAll: () => api.get<Task[]>('/api/tasks'),
  getById: (id: string) => api.get<Task>(`/api/tasks/${id}`),
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Task>('/api/tasks', task),
  update: (id: string, task: Partial<Task>) => 
    api.put<Task>(`/api/tasks/${id}`, task),
  delete: (id: string) => api.delete(`/api/tasks/${id}`),
};
