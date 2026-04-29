import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedContainerProps extends Omit<
  HTMLMotionProps<'div'>,
  'children'
> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function FadeInScale({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function SlideIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = 'left',
  className = '',
  ...props
}: AnimatedContainerProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
  const x = direction === 'left' ? -50 : direction === 'right' ? 50 : 0;
  const y = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  ...props
}: AnimatedContainerProps & { staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: 'easeOut' },
        },
      }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function HoverScale({
  children,
  scale = 1.05,
  className = '',
  ...props
}: AnimatedContainerProps & { scale?: number }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function FloatAnimation({
  children,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function PulseAnimation({
  children,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

export function RotateIn({
  children,
  delay = 0,
  duration = 0.6,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10, scale: 0.9 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}

// Page transition wrapper
export function PageTransition({
  children,
  className = '',
  ...props
}: AnimatedContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
      {...props}>
      {children}
    </motion.div>
  );
}
