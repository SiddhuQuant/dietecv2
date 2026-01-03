import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function ThemeToggle({ isDarkMode, onToggle, size = "sm", variant = "ghost" }: ThemeToggleProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onToggle}
      className="p-2"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-4 w-4 text-yellow-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
      )}
    </Button>
  );
}