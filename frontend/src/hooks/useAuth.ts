import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useToast } from './useToast';
import { authAPI } from '../services/api';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import type { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, logout } = useAuthStore();
  const { success, error: showError } = useToast();

  const handleAuth = async (
    authFn: () => Promise<{ token: string; user: any }>,
    successMessage: string,
    successCallback?: () => void
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authFn();
      login(response.user, response.token);
      success(successMessage);
      successCallback?.();
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'An error occurred';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateLogin = (credentials: LoginRequest): boolean => {
    const emailValidation = validateEmail(credentials.email);
    const passwordValidation = validatePassword(credentials.password);

    if (!emailValidation.isValid) {
      showError(emailValidation.errors[0]);
      return false;
    }

    if (!passwordValidation.isValid) {
      showError(passwordValidation.errors[0]);
      return false;
    }

    return true;
  };

  const validateRegister = (userData: RegisterRequest): boolean => {
    const nameValidation = validateName(userData.name);
    const emailValidation = validateEmail(userData.email);
    const passwordValidation = validatePassword(userData.password);

    if (!nameValidation.isValid) {
      showError(nameValidation.errors[0]);
      return false;
    }

    if (!emailValidation.isValid) {
      showError(emailValidation.errors[0]);
      return false;
    }

    if (!passwordValidation.isValid) {
      showError(passwordValidation.errors[0]);
      return false;
    }

    return true;
  };

  const handleLogin = async (credentials: LoginRequest, successCallback?: () => void) => {
    if (!validateLogin(credentials)) return;
    
    await handleAuth(
      () => authAPI.login(credentials),
      'Login successful!',
      successCallback
    );
  };

  const handleRegister = async (userData: RegisterRequest, successCallback?: () => void) => {
    if (!validateRegister(userData)) return;
    
    await handleAuth(
      () => authAPI.register(userData),
      'Account created successfully!',
      successCallback
    );
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
