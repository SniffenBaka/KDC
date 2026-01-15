import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';
import './GradientText.css';

// Color presets
const COLOR_PRESETS = {
  default: ['#5227FF', '#FF9FFC', '#B19EEF'],
  header: ['#6D28D9', '#8B5CF6', '#A78BFA', '#7C3AED'], // Darker purple for section headers
  number: ['#5B21B6', '#7C3AED', '#9333EA', '#6B21A8'], // Dark bold purple for numbers
  main: ['#7B3FE4', '#A855F7', '#CBA7FF'] // Original main header
};

export default function GradientText({
  children,
  className = '',
  colors = null,
  preset = 'default', // New preset prop
  animationSpeed = 8,
  showBorder = false,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}) {
  // Use preset if colors not explicitly provided
  const finalColors = colors || COLOR_PRESETS[preset] || COLOR_PRESETS.default;
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);

  const animationDuration = animationSpeed * 1000;

  useAnimationFrame(time => {
    if (isPaused) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    elapsedRef.current += deltaTime;

    if (yoyo) {
      const fullCycle = animationDuration * 2;
      const cycleTime = elapsedRef.current % fullCycle;

      if (cycleTime < animationDuration) {
        progress.set((cycleTime / animationDuration) * 100);
      } else {
        progress.set(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
      }
    } else {
      progress.set((elapsedRef.current / animationDuration) * 100);
    }
  });

  useEffect(() => {
    elapsedRef.current = 0;
    progress.set(0);
  }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, p => {
    if (direction === 'horizontal') return `${p}% 50%`;
    if (direction === 'vertical') return `50% ${p}%`;
    return `${p}% 50%`;
  });

  const gradientAngle =
    direction === 'horizontal'
      ? 'to right'
      : direction === 'vertical'
      ? 'to bottom'
      : 'to bottom right';

  const gradientColors = [...finalColors, finalColors[0]].join(', ');

  const gradientStyle = {
    backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
    backgroundSize:
      direction === 'horizontal'
        ? '300% 100%'
        : direction === 'vertical'
        ? '100% 300%'
        : '300% 300%',
    backgroundRepeat: 'repeat'
  };

  return (
    <motion.div className={`animated-gradient-text ${className}`}>
      <motion.div
        className="text-content"
        style={{ ...gradientStyle, backgroundPosition }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
