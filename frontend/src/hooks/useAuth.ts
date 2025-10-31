import { useState, useEffect } from 'react';
import { authService, User } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Mock implementation for now
      setUser({ id: '1', email: 'user@example.com', name: 'Demo User' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login for now
      const mockUser = { id: '1', email, name: 'Demo User' };
      const mockToken = 'mock-token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      // Mock registration for now
      const mockUser = { id: '1', ...userData };
      const mockToken = 'mock-token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return { user: mockUser, token: mockToken };
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
  };
};
