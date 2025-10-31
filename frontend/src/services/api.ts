import axios from 'axios';

// Para Vercel, usamos caminhos relativos já que está no mesmo deploy
const API_URL = '/api';

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

export interface User {
  id: string;
  email: string;
  name: string;
}

export const taskService = {
  getAll: () => api.get<Task[]>('/tasks'),
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Task>('/tasks', task),
  update: (id: string, task: Partial<Task>) => 
    api.put<Task>(`/tasks/${id}`, task),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const authService = {
  login: (email: string, password: string) => 
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),
  register: (user: Omit<User, 'id'> & { password: string }) => 
    api.post<{ user: User; token: string }>('/auth/register', user),
  getProfile: () => api.get<User>('/auth/profile'),
};
