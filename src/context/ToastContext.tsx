import { createContext, useContext, useRef, useCallback } from 'react';
import { Toast } from 'primereact/toast';

type Severity = 'success' | 'info' | 'warn' | 'error';

interface ToastContextValue {
  showToast: (severity: Severity, summary: string, detail?: string, life?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((severity: Severity, summary: string, detail?: string, life?: number) => {
    toastRef.current?.show({
      severity,
      summary,
      detail,
      life: life ?? (severity === 'error' ? 5000 : 3000),
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
