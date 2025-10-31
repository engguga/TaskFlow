import { useState, useEffect } from 'react';
import { User } from '../services/api';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ id: '1', email: 'user@example.com', name: 'Demo User' });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    try {
      setError(null);
      // Mock login for now
      const mockUser = { id: '1', email, name: 'Demo User' };
      const mockToken = 'mock-token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return { user: mockUser, token: mockToken };
    } catch (err) {
      setError('Login failed');
      throw err;
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    try {
      setError(null);
      // Mock registration for now
      const mockUser = { id: '1', ...userData };
      const mockToken = 'mock-token';
      
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
      
      return { user: mockUser, token: mockToken };
    } catch (err) {
      setError('Registration failed');
      throw err;
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
    error,
  };
};
