import React, { useState, useEffect } from 'react';
        import { motion, AnimatePresence } from 'framer-motion';
        import Icon from '../AppIcon';

        const ToastNotification = ({ 
          message, 
          type = 'info', 
          duration = 4000, 
          onClose, 
          isVisible 
        }) => {
          const [show, setShow] = useState(isVisible);

          useEffect(() => {
            setShow(isVisible);
          }, [isVisible]);

          useEffect(() => {
            if (show && duration > 0) {
              const timer = setTimeout(() => {
                setShow(false);
                onClose?.();
              }, duration);
              
              return () => clearTimeout(timer);
            }
          }, [show, duration, onClose]);

          const getToastStyles = () => {
            switch (type) {
              case 'success':
                return {
                  bgColor: 'bg-green-50 dark:bg-green-900/20',
                  borderColor: 'border-green-200 dark:border-green-800',
                  iconColor: 'text-green-500',
                  textColor: 'text-green-800 dark:text-green-200',
                  icon: 'CheckCircle'
                };
              case 'error':
                return {
                  bgColor: 'bg-red-50 dark:bg-red-900/20',
                  borderColor: 'border-red-200 dark:border-red-800',
                  iconColor: 'text-red-500',
                  textColor: 'text-red-800 dark:text-red-200',
                  icon: 'AlertCircle'
                };
              case 'warning':
                return {
                  bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
                  borderColor: 'border-yellow-200 dark:border-yellow-800',
                  iconColor: 'text-yellow-500',
                  textColor: 'text-yellow-800 dark:text-yellow-200',
                  icon: 'AlertTriangle'
                };
              default:
                return {
                  bgColor: 'bg-blue-50 dark:bg-blue-900/20',
                  borderColor: 'border-blue-200 dark:border-blue-800',
                  iconColor: 'text-blue-500',
                  textColor: 'text-blue-800 dark:text-blue-200',
                  icon: 'Info'
                };
            }
          };

          const handleClose = () => {
            setShow(false);
            onClose?.();
          };

          const styles = getToastStyles();

          return (
            <AnimatePresence>
              {show && (
                <motion.div
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -50, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    fixed top-4 right-4 z-50 max-w-sm w-full mx-auto
                    ${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-lg
                    p-4 flex items-start space-x-3
                  `}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 ${styles.iconColor}`}>
                    <Icon name={styles.icon} size={20} />
                  </div>

                  {/* Message */}
                  <div className={`flex-1 ${styles.textColor}`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={handleClose}
                    className={`
                      flex-shrink-0 ${styles.iconColor} hover:opacity-70 
                      transition-opacity duration-200
                    `}
                  >
                    <Icon name="X" size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          );
        };

        export default ToastNotification;