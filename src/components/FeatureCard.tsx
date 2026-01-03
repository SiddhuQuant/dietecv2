import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { ReactNode } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  emoji?: string;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
  borderColor?: string;
  onClick?: () => void;
  badge?: ReactNode;
  featured?: boolean;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  emoji,
  gradient = "from-blue-500 to-cyan-500",
  iconBg = "bg-blue-100 dark:bg-blue-900/40",
  iconColor = "text-blue-600 dark:text-blue-400",
  borderColor = "border-blue-200 dark:border-blue-800",
  onClick,
  badge,
  featured = false
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`p-5 bg-card border-2 ${borderColor} ${
          onClick ? 'cursor-pointer' : ''
        } card-hover overflow-hidden relative group ${
          featured ? 'shadow-lg' : ''
        }`}
        onClick={onClick}
      >
        {/* Background Gradient on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="flex items-center space-x-4 relative z-10">
          <motion.div 
            className={`${iconBg} p-4 rounded-2xl shadow-sm`}
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className={`h-7 w-7 ${iconColor}`} />
          </motion.div>
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {badge && <div className="mt-2">{badge}</div>}
          </div>
          {emoji && (
            <motion.div 
              className="text-3xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
            >
              {emoji}
            </motion.div>
          )}
        </div>
        
        {/* Shimmer Effect on Hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none"></div>
      </Card>
    </motion.div>
  );
}
