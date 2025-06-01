import { useState } from 'react';
import Toast from '../components/Toast';

export function useToast() {
  const [toast, setToast] = useState<null | {
    message: string;
    type?: 'success' | 'error' | 'info';
  }>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type || 'success'}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
} 