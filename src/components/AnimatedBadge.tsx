import { motion } from "motion/react";

interface AnimatedBadgeProps {
  text: string;
  variant?: "new" | "featured" | "popular" | "limited" | "pro";
  animated?: boolean;
  icon?: string;
}

export function AnimatedBadge({
  text,
  variant = "new",
  animated = true,
  icon
}: AnimatedBadgeProps) {
  const variantStyles = {
    new: {
      bg: "bg-gradient-to-r from-emerald-500 to-teal-500",
      glow: "shadow-emerald-500/50"
    },
    featured: {
      bg: "bg-gradient-to-r from-purple-500 to-pink-500",
      glow: "shadow-purple-500/50"
    },
    popular: {
      bg: "bg-gradient-to-r from-orange-500 to-red-500",
      glow: "shadow-orange-500/50"
    },
    limited: {
      bg: "bg-gradient-to-r from-yellow-500 to-amber-500",
      glow: "shadow-yellow-500/50"
    },
    pro: {
      bg: "bg-gradient-to-r from-blue-500 to-cyan-500",
      glow: "shadow-blue-500/50"
    }
  };

  const styles = variantStyles[variant];

  const AnimationWrapper = animated ? motion.span : 'span';
  const animationProps = animated ? {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.1 },
    transition: { type: "spring", stiffness: 200, damping: 10 }
  } : {};

  return (
    <AnimationWrapper
      {...animationProps}
      className={`inline-flex items-center space-x-1 text-xs ${styles.bg} text-white px-3 py-1 rounded-full shadow-lg ${styles.glow} font-semibold`}
    >
      {icon && <span>{icon}</span>}
      <span>{text}</span>
    </AnimationWrapper>
  );
}
