import { motion } from "motion/react";

interface AnimatedBackgroundProps {
  variant?: "default" | "health" | "medical" | "wellness" | "emergency";
}

export function AnimatedBackground({ variant = "default" }: AnimatedBackgroundProps) {
  const variants = {
    default: {
      orbs: [
        { color: "bg-teal-500/10", size: "w-96 h-96", position: "top-0 right-0", delay: 0 },
        { color: "bg-blue-500/10", size: "w-96 h-96", position: "bottom-0 left-0", delay: 1 },
        { color: "bg-purple-500/5", size: "w-96 h-96", position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", delay: 2 }
      ]
    },
    health: {
      orbs: [
        { color: "bg-green-500/10", size: "w-80 h-80", position: "top-10 right-10", delay: 0 },
        { color: "bg-emerald-500/10", size: "w-72 h-72", position: "bottom-20 left-10", delay: 1.5 },
        { color: "bg-teal-500/8", size: "w-64 h-64", position: "top-1/3 left-1/3", delay: 0.8 }
      ]
    },
    medical: {
      orbs: [
        { color: "bg-blue-500/12", size: "w-88 h-88", position: "top-0 left-1/4", delay: 0 },
        { color: "bg-cyan-500/10", size: "w-76 h-76", position: "bottom-10 right-1/4", delay: 1.2 },
        { color: "bg-indigo-500/8", size: "w-64 h-64", position: "top-2/3 left-2/3", delay: 2.5 }
      ]
    },
    wellness: {
      orbs: [
        { color: "bg-purple-500/10", size: "w-80 h-80", position: "top-20 left-20", delay: 0 },
        { color: "bg-pink-500/10", size: "w-72 h-72", position: "bottom-10 right-20", delay: 1 },
        { color: "bg-violet-500/8", size: "w-64 h-64", position: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", delay: 2 }
      ]
    },
    emergency: {
      orbs: [
        { color: "bg-red-500/10", size: "w-96 h-96", position: "top-0 right-0", delay: 0 },
        { color: "bg-orange-500/10", size: "w-80 h-80", position: "bottom-0 left-0", delay: 1 },
        { color: "bg-rose-500/8", size: "w-72 h-72", position: "top-1/3 left-1/2 -translate-x-1/2", delay: 1.5 }
      ]
    }
  };

  const { orbs } = variants[variant];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className={`absolute ${orb.size} ${orb.color} ${orb.position} rounded-full blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8 + index,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay
          }}
        />
      ))}
    </div>
  );
}
