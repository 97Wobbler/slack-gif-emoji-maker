import { useState } from 'react';
import Toast from '../components/Toast';

export function useToast() {
  const [toast, setToast] = useState<null | {
    message: string;
    type?: 'success' | 'error';
  }>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const ToastComponent = toast ? (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={() => setToast(null)}
    />
  ) : null;

  return { showToast, ToastComponent };
} 