import { useState, useCallback } from 'react';

        const useToast = () => {
          const [toasts, setToasts] = useState([]);

          const showToast = useCallback((message, type = 'info', duration = 4000) => {
            const id = Date.now() + Math.random();
            const toast = { id, message, type, duration, isVisible: true };
            
            setToasts(prevToasts => [...prevToasts, toast]);
            
            return id;
          }, []);

          const hideToast = useCallback((id) => {
            setToasts(prevToasts => 
              prevToasts.filter(toast => toast.id !== id)
            );
          }, []);

          const success = useCallback((message, duration) => 
            showToast(message, 'success', duration), [showToast]
          );
          
          const error = useCallback((message, duration) => 
            showToast(message, 'error', duration), [showToast]
          );
          
          const warning = useCallback((message, duration) => 
            showToast(message, 'warning', duration), [showToast]
          );
          
          const info = useCallback((message, duration) => 
            showToast(message, 'info', duration), [showToast]
          );

          return {
            toasts,
            showToast,
            hideToast,
            success,
            error,
            warning,
            info
          };
        };

        export default useToast;