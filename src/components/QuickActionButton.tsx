import { LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "motion/react";

interface QuickActionButtonProps {
  label: string;
  icon: LucideIcon;
  emoji?: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "success" | "warning";
  size?: "sm" | "md" | "lg";
  pulse?: boolean;
  className?: string;
}

export function QuickActionButton({
  label,
  icon: Icon,
  emoji,
  onClick,
  variant = "primary",
  size = "md",
  pulse = false,
  className = ""
}: QuickActionButtonProps) {
  const variantStyles = {
    primary: "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
    warning: "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
  };

  const sizeStyles = {
    sm: "py-3 text-sm",
    md: "py-4 text-base",
    lg: "py-6 text-lg"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button 
        className={`w-full ${variantStyles[variant]} ${sizeStyles[size]} text-white shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group ${
          pulse ? 'pulse-glow' : ''
        } ${className}`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
        <div className="relative z-10 flex items-center justify-center space-x-2">
          <motion.div
            animate={pulse ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Icon className={`h-${size === 'lg' ? '6' : size === 'md' ? '5' : '4'} w-${size === 'lg' ? '6' : size === 'md' ? '5' : '4'}`} />
          </motion.div>
          <span>{label}</span>
          {emoji && <span>{emoji}</span>}
        </div>
      </Button>
    </motion.div>
  );
}
