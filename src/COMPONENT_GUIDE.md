# DIETEC Component Guide

Quick reference guide for using the enhanced components in the DIETEC app.

## 🎨 Design Components

### AnimatedBadge
**Purpose**: Eye-catching labels for features
```tsx
<AnimatedBadge 
  text="NEW" 
  variant="new" 
  icon="✨" 
  animated={true} 
/>
```
**Variants**: `new`, `featured`, `popular`, `limited`, `pro`

---

### AnimatedBackground
**Purpose**: Decorative floating gradient orbs
```tsx
<AnimatedBackground variant="health" />
```
**Variants**: `default`, `health`, `medical`, `wellness`, `emergency`

---

### FeatureCard
**Purpose**: Standard feature card with hover effects
```tsx
<FeatureCard
  title="Diet Guide"
  description="Healthy meals with local ingredients"
  icon={Utensils}
  emoji="🥗"
  gradient="from-green-500 to-lime-500"
  iconBg="bg-green-100 dark:bg-green-900/40"
  iconColor="text-green-600"
  borderColor="border-green-200"
  onClick={() => navigate('diet')}
  badge={<AnimatedBadge text="Popular" />}
/>
```

---

### InfoBanner
**Purpose**: Alerts, tips, and informational messages
```tsx
<InfoBanner
  title="Health Tip"
  message="Drink 8 glasses of water daily!"
  emoji="💧"
  variant="tip"
  animated={true}
/>
```
**Variants**: `info`, `success`, `warning`, `danger`, `tip`

---

### LoadingScreen
**Purpose**: Initial app loading screen
```tsx
{isLoading && <LoadingScreen />}
```

---

### ProgressRing
**Purpose**: Circular progress indicator
```tsx
<ProgressRing
  value={6500}
  max={8000}
  size="md"
  color="#14b8a6"
  label="Steps"
  emoji="👣"
  showPercentage={true}
  animated={true}
/>
```
**Sizes**: `sm`, `md`, `lg`

---

### QuickActionButton
**Purpose**: Large, accessible action buttons
```tsx
<QuickActionButton
  label="Emergency Call"
  icon={Phone}
  emoji="🚨"
  onClick={handleEmergency}
  variant="danger"
  size="lg"
  pulse={true}
/>
```
**Variants**: `primary`, `danger`, `success`, `warning`
**Sizes**: `sm`, `md`, `lg`

---

### SectionHeader
**Purpose**: Consistent page headers with navigation
```tsx
<SectionHeader
  title="Diet & Nutrition"
  subtitle="Healthy eating made simple"
  icon={Utensils}
  emoji="🥗"
  onBack={() => navigate('home')}
  isDarkMode={isDarkMode}
  onToggleTheme={toggleTheme}
  gradient="from-green-600 to-lime-600"
/>
```

---

### StatsCard
**Purpose**: Display metrics and statistics
```tsx
<StatsCard
  icon={Droplets}
  emoji="💧"
  label="Water Intake"
  value="6/8 cups"
  trend="up"
  trendValue="+2 today"
  gradient="from-blue-500 to-cyan-500"
/>
```
**Trends**: `up`, `down`, `neutral`

---

### ToastNotification
**Purpose**: Temporary notification messages
```tsx
<ToastNotification
  message="Profile updated successfully!"
  type="success"
  duration={3000}
  show={showToast}
  onClose={() => setShowToast(false)}
/>
```
**Types**: `success`, `error`, `info`, `warning`

---

## 🎭 Animation Utilities

### Motion Components
All interactive elements use Motion (Framer Motion) for smooth animations:

```tsx
import { motion } from "motion/react";

<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  Content
</motion.div>
```

### CSS Animation Classes
Available in `globals.css`:

- `card-hover` - Smooth card lift on hover
- `pulse-glow` - Pulsing glow effect
- `shimmer` - Light sweep effect
- `float-animation` - Floating up/down
- `slide-in` - Slide from left
- `fade-in` - Fade in
- `scale-in` - Scale up entrance

**Usage**:
```tsx
<div className="card-hover pulse-glow">
  Animated Card
</div>
```

---

## 🎨 Gradient Classes

### Predefined Gradients
```tsx
// Backgrounds
className="gradient-primary"      // Blue to Cyan
className="gradient-success"      // Green shades
className="gradient-warning"      // Yellow to Orange
className="gradient-danger"       // Red shades
className="gradient-health"       // Multi-color health theme
className="gradient-mesh"         // Mesh background
```

### Tailwind Gradients
```tsx
// Text gradients
className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent"

// Background gradients
className="bg-gradient-to-br from-green-50 to-emerald-50"
```

---

## 🎯 Color Coding System

### Feature Categories
- **Blue/Cyan**: Medical, Doctor services
- **Green/Teal**: Diet, Nutrition, Health
- **Red/Pink**: Emergency, Alerts
- **Purple/Violet**: Exercise, Wellness
- **Orange/Yellow**: Warnings, Tips
- **Indigo**: Information, Q&A

---

## 📱 Responsive Design

### Mobile-First Approach
All components are designed mobile-first with these breakpoints:

```tsx
// Base styles for mobile
className="p-4"

// Tablet and up
className="md:p-6"

// Desktop
className="lg:p-8"
```

### Touch Targets
Minimum touch target sizes:
- Buttons: `py-4` (48px+)
- Icons: `h-6 w-6` or larger
- Cards: `p-5` minimum padding

---

## ♿ Accessibility Features

### Visual Cues
1. **Icons + Emojis**: Dual visual indicators
2. **Color Coding**: Consistent category colors
3. **Large Text**: Base size 16px
4. **High Contrast**: WCAG AA compliant

### Interaction Feedback
1. **Hover States**: Scale, shadow, color changes
2. **Active States**: Scale down on tap
3. **Focus States**: Ring indicators
4. **Loading States**: Skeleton or spinner

---

## 🌓 Dark Mode

All components support dark mode automatically:

```tsx
// Light mode
className="bg-white text-gray-900"

// Dark mode
className="dark:bg-gray-900 dark:text-white"
```

Toggle dark mode:
```tsx
<ThemeToggle 
  isDarkMode={isDarkMode} 
  onToggle={toggleTheme} 
/>
```

---

## 🚀 Performance Tips

1. **Use Motion sparingly** on lists (stagger children)
2. **Lazy load** components not in viewport
3. **Optimize images** with ImageWithFallback
4. **Memoize expensive** calculations
5. **Debounce user input** for search/filter

---

## 📦 Import Patterns

### Individual Imports
```tsx
import { FeatureCard } from './components/FeatureCard';
import { InfoBanner } from './components/InfoBanner';
```

### Batch Imports
```tsx
import { 
  FeatureCard, 
  InfoBanner, 
  StatsCard 
} from './components';
```

### Icon Imports
```tsx
import { Heart, Utensils, Activity } from 'lucide-react';
```

---

## 🎬 Common Patterns

### Feature List
```tsx
const features = [
  {
    title: "Feature Name",
    description: "Description",
    icon: IconComponent,
    emoji: "🎉",
    gradient: "from-blue-500 to-cyan-500",
    onClick: () => handleClick()
  }
];

return (
  <div className="space-y-3">
    {features.map((feature, i) => (
      <FeatureCard key={i} {...feature} />
    ))}
  </div>
);
```

### Stats Grid
```tsx
<div className="grid grid-cols-3 gap-3">
  <StatsCard {...stat1} />
  <StatsCard {...stat2} />
  <StatsCard {...stat3} />
</div>
```

### Page Layout
```tsx
<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
  <AnimatedBackground variant="health" />
  <SectionHeader {...headerProps} />
  
  <div className="max-w-md mx-auto p-4">
    {/* Content */}
  </div>
</div>
```

---

## 🐛 Debugging

### Check Component Rendering
```tsx
console.log('Component props:', { title, icon, onClick });
```

### Verify Animations
Add `transition={{ duration: 10 }}` to slow down animations for debugging

### Dark Mode Testing
```tsx
// Manually toggle
document.documentElement.classList.toggle('dark');
```

---

**Last Updated**: October 2025
**Version**: 2.0
