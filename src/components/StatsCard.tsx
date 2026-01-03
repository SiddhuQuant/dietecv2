import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";

interface StatsCardProps {
  icon: LucideIcon;
  emoji?: string;
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  gradient?: string;
  iconColor?: string;
  bgColor?: string;
}

export function StatsCard({
  icon: Icon,
  emoji,
  label,
  value,
  trend,
  trendValue,
  gradient = "from-blue-500 to-cyan-500",
  iconColor = "text-blue-600 dark:text-blue-400",
  bgColor = "from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`p-4 text-center bg-gradient-to-br ${bgColor} border-2 overflow-hidden relative group`}>
        {/* Background decoration */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          {emoji ? (
            <motion.div 
              className="text-3xl mb-2"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              {emoji}
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Icon className={`h-8 w-8 ${iconColor} mx-auto mb-2`} />
            </motion.div>
          )}
          
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="font-bold text-lg">{value}</p>
          
          {trend && trendValue && (
            <div className={`text-xs mt-1 flex items-center justify-center space-x-1 ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' :
              'text-gray-600'
            }`}>
              <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
