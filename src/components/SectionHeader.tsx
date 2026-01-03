import { ArrowLeft, LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "motion/react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  emoji?: string;
  onBack?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  gradient?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
  emoji,
  onBack,
  isDarkMode,
  onToggleTheme,
  gradient = "from-teal-600 to-blue-600",
  actions
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 flex-1">
          {onBack && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="hover:bg-teal-50 dark:hover:bg-teal-900/20"
              >
                <ArrowLeft className="h-5 w-5 text-teal-600" />
              </Button>
            </motion.div>
          )}
          
          <div className="flex items-center space-x-3">
            {Icon && (
              <motion.div
                whileHover={{ rotate: [0, -10, 10, 0] }}
                className="p-2 bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/40 dark:to-blue-900/40 rounded-xl"
              >
                <Icon className={`h-6 w-6 bg-gradient-to-r ${gradient} bg-clip-text text-transparent`} />
              </motion.div>
            )}
            
            {emoji && (
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-3xl"
              >
                {emoji}
              </motion.div>
            )}
            
            <div>
              <h1 className={`text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {actions}
          {onToggleTheme && isDarkMode !== undefined && (
            <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
