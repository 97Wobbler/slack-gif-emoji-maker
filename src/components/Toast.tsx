import { useEffect, useRef, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
  duration?: number; // in milliseconds
}

export default function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);
  const hideTimeout = useRef<number | null>(null);
  const removeTimeout = useRef<number | null>(null);

  const startFadeOut = () => {
    hideTimeout.current = setTimeout(() => {
      setVisible(false);
      removeTimeout.current = setTimeout(onClose, 1000); // match transition
    }, duration);
  };

  const cancelFadeOut = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    if (removeTimeout.current) clearTimeout(removeTimeout.current);
    setVisible(true);
  };

  useEffect(() => {
    startFadeOut();
    return () => {
      cancelFadeOut();
    };
  }, []);

  const baseStyle =
    'fixed bottom-5 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg text-sm text-white z-[9999] transition-opacity duration-1000';
  const typeStyle =
    type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div
      className={`${baseStyle} ${typeStyle} ${visible ? 'opacity-95' : 'opacity-0'}`}
      onMouseEnter={cancelFadeOut}
      onMouseLeave={startFadeOut}
    >
      {message}
    </div>
  );
} 