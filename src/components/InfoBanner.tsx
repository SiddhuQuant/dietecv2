import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface InfoBannerProps {
  title?: string;
  message: string | ReactNode;
  icon?: LucideIcon;
  emoji?: string;
  variant?: "info" | "success" | "warning" | "danger" | "tip";
  animated?: boolean;
}

export function InfoBanner({
  title,
  message,
  icon: Icon,
  emoji,
  variant = "info",
  animated = false
}: InfoBannerProps) {
  const variantStyles = {
    info: {
      gradient: "from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-800 dark:text-blue-200",
      titleColor: "text-blue-900 dark:text-blue-100",
      iconColor: "text-blue-500"
    },
    success: {
      gradient: "from-green-50 via-emerald-50 to-green-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-green-900/20",
      border: "border-green-200 dark:border-green-800",
      textColor: "text-green-800 dark:text-green-200",
      titleColor: "text-green-900 dark:text-green-100",
      iconColor: "text-green-500"
    },
    warning: {
      gradient: "from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20",
      border: "border-yellow-300 dark:border-yellow-700",
      textColor: "text-yellow-800 dark:text-yellow-200",
      titleColor: "text-yellow-900 dark:text-yellow-100",
      iconColor: "text-yellow-500"
    },
    danger: {
      gradient: "from-red-50 via-rose-50 to-red-50 dark:from-red-900/20 dark:via-rose-900/20 dark:to-red-900/20",
      border: "border-red-200 dark:border-red-800",
      textColor: "text-red-800 dark:text-red-200",
      titleColor: "text-red-900 dark:text-red-100",
      iconColor: "text-red-500"
    },
    tip: {
      gradient: "from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-800 dark:text-purple-200",
      titleColor: "text-purple-900 dark:text-purple-100",
      iconColor: "text-purple-500"
    }
  };

  const styles = variantStyles[variant];

  const AnimationWrapper = animated ? motion.div : 'div';
  const animationProps = animated ? {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  } : {};

  return (
    <AnimationWrapper {...animationProps}>
      <Card className={`p-5 bg-gradient-to-br ${styles.gradient} border-2 ${styles.border} shadow-md`}>
        <div className="flex items-start space-x-3">
          {Icon && (
            <motion.div
              animate={animated ? {
                y: [0, -5, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className={`h-6 w-6 ${styles.iconColor} flex-shrink-0 mt-0.5`} />
            </motion.div>
          )}
          
          {emoji && (
            <motion.div
              className="text-2xl flex-shrink-0"
              animate={animated ? {
                rotate: [0, 10, -10, 0],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {emoji}
            </motion.div>
          )}
          
          <div className="flex-1">
            {title && (
              <h4 className={`font-semibold ${styles.titleColor} mb-1`}>{title}</h4>
            )}
            <div className={`text-sm ${styles.textColor}`}>
              {message}
            </div>
          </div>
        </div>
      </Card>
    </AnimationWrapper>
  );
}
