import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info, XCircle, X } from "lucide-react";
import { useState, useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
  show: boolean;
}

export function ToastNotification({
  message,
  type = "info",
  duration = 3000,
  onClose,
  show
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const config = {
    success: {
      icon: CheckCircle,
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600"
    },
    error: {
      icon: XCircle,
      gradient: "from-red-500 to-rose-500",
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600"
    },
    warning: {
      icon: AlertCircle,
      gradient: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "border-yellow-200 dark:border-yellow-800",
      iconColor: "text-yellow-600"
    },
    info: {
      icon: Info,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600"
    }
  };

  const { icon: Icon, gradient, bg, border, iconColor } = config[type];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`${bg} ${border} border-2 rounded-xl shadow-lg p-4 flex items-center space-x-3`}>
            <div className={`bg-gradient-to-r ${gradient} p-2 rounded-lg`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            
            <p className="flex-1 text-sm font-medium text-foreground">{message}</p>
            
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Progress bar */}
          {duration > 0 && (
            <motion.div
              className={`h-1 bg-gradient-to-r ${gradient} rounded-b-xl`}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
