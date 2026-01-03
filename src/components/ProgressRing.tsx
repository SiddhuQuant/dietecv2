import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  backgroundColor?: string;
  label?: string;
  icon?: LucideIcon;
  emoji?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressRing({
  value,
  max,
  size = "md",
  color = "#14b8a6",
  backgroundColor = "#e5e7eb",
  label,
  icon: Icon,
  emoji,
  showPercentage = true,
  animated = true
}: ProgressRingProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const sizes = {
    sm: { outer: 60, inner: 48, stroke: 6, text: "text-sm", icon: 4 },
    md: { outer: 80, inner: 64, stroke: 8, text: "text-base", icon: 5 },
    lg: { outer: 100, inner: 80, stroke: 10, text: "text-lg", icon: 6 }
  };
  
  const { outer, inner, stroke, text, icon: iconSize } = sizes[size];
  const radius = (outer - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={outer} height={outer} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={stroke}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={outer / 2}
          cy={outer / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? circumference : offset}
          animate={animated ? { strokeDashoffset: offset } : {}}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {Icon && (
          <Icon className={`h-${iconSize} w-${iconSize} mb-1`} style={{ color }} />
        )}
        {emoji && <div className="text-xl mb-1">{emoji}</div>}
        
        {showPercentage && (
          <motion.div
            className={`font-bold ${text}`}
            style={{ color }}
            initial={animated ? { scale: 0 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={{ delay: 0.5, type: "spring" }}
          >
            {Math.round(percentage)}%
          </motion.div>
        )}
        
        {label && (
          <div className="text-xs text-muted-foreground mt-1">{label}</div>
        )}
      </div>
    </div>
  );
}
