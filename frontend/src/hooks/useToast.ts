import { useToastStore } from '../store/toastStore';
import type { ToastType } from '../components/ui/Toast';

export const useToast = () => {
  const { addToast } = useToastStore();

  const showToast = (message: string, type: ToastType = 'info', duration?: number) => {
    addToast(message, type, duration);
  };

  const success = (message: string, duration?: number) => {
    showToast(message, 'success', duration);
  };

  const error = (message: string, duration?: number) => {
    showToast(message, 'error', duration);
  };

  const warning = (message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  };

  const info = (message: string, duration?: number) => {
    showToast(message, 'info', duration);
  };

  return {
    success,
    error,
    warning,
    info,
    showToast
  };
};
