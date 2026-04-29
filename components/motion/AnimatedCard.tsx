import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
}

export function AnimatedCard({
  children,
  className = '',
  delay = 0,
  hoverEffect = true,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={
        hoverEffect
          ? {
              y: -5,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }
          : undefined
      }
      className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedStatCard({
  children,
  className = '',
  delay = 0,
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function AnimatedProgressBar({
  value,
  className = '',
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`h-full bg-primary ${className}`}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ delay, duration: 1, ease: 'easeOut' }}
    />
  );
}

export function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  duration = 1,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.3 }}>
        {prefix}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.1, duration }}>
        {value.toLocaleString()}
      </motion.span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}>
        {suffix}
      </motion.span>
    </motion.span>
  );
}
