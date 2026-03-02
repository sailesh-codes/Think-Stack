import { useState, useCallback } from "react";
import { ModernToast } from "./ModernToast";

interface ToastData {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  description?: string;
  duration?: number;
}

export function ModernToastManager() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((toast: Omit<ToastData, "id">) => {
    const id = Date.now().toString();
    const newToast: ToastData = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Global toast functions
  (window as any).modernToast = {
    success: (title: string, description?: string, duration?: number) =>
      addToast({ type: "success", title, description, duration }),
    error: (title: string, description?: string, duration?: number) =>
      addToast({ type: "error", title, description, duration }),
    warning: (title: string, description?: string, duration?: number) =>
      addToast({ type: "warning", title, description, duration }),
    info: (title: string, description?: string, duration?: number) =>
      addToast({ type: "info", title, description, duration })
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ModernToast
            id={toast.id}
            type={toast.type}
            title={toast.title}
            description={toast.description}
            onClose={removeToast}
            duration={toast.duration}
          />
        </div>
      ))}
    </div>
  );
}

// Hook to use modern toast
export function useModernToast() {
  return {
    success: (title: string, description?: string, duration?: number) =>
      (window as any).modernToast?.success(title, description, duration),
    error: (title: string, description?: string, duration?: number) =>
      (window as any).modernToast?.error(title, description, duration),
    warning: (title: string, description?: string, duration?: number) =>
      (window as any).modernToast?.warning(title, description, duration),
    info: (title: string, description?: string, duration?: number) =>
      (window as any).modernToast?.info(title, description, duration)
  };
}
