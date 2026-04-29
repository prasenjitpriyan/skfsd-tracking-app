import { animate, motion, useInView, Variants } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number | 'some' | 'all';
}

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

const rotateInVariants: Variants = {
  hidden: { opacity: 0, rotate: -5, scale: 0.95 },
  visible: { opacity: 1, rotate: 0, scale: 1 },
};

export function ScrollFadeUp({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUpVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollFadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollScaleUp({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={scaleUpVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollSlideLeft({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={slideLeftVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollSlideRight({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={slideRightVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollRotateIn({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  once = true,
  amount = 0.3,
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={rotateInVariants}
      transition={{ delay, duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  );
}

interface ScrollStaggerProps extends ScrollAnimationProps {
  staggerDelay?: number;
}

export function ScrollStaggerContainer({
  children,
  className = '',
  delay = 0,
  staggerDelay = 0.1,
  once = true,
  amount = 0.2,
}: ScrollStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}>
      {children}
    </motion.div>
  );
}

export function ScrollStaggerItem({
  children,
  className = '',
  duration = 0.5,
}: Omit<ScrollAnimationProps, 'delay' | 'once' | 'amount'>) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}>
      {children}
    </motion.div>
  );
}

// Counter animation that triggers on scroll
interface ScrollCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

export function ScrollCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 2,
  className = '',
}: ScrollCounterProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
        onUpdate: (latest) => {
          setDisplayValue(Math.round(latest));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
}

// Progress bar that animates on scroll
interface ScrollProgressProps {
  value: number;
  className?: string;
  barClassName?: string;
  duration?: number;
}

export function ScrollProgress({
  value,
  className = '',
  barClassName = '',
  duration = 1,
}: ScrollProgressProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div
      ref={ref}
      className={`h-3 bg-muted rounded-full overflow-hidden ${className}`}>
      <motion.div
        className={`h-full bg-primary rounded-full ${barClassName}`}
        initial={{ width: 0 }}
        animate={isInView ? { width: `${value}%` } : { width: 0 }}
        transition={{ duration, ease: [0.25, 0.46, 0.45, 0.94] }}
      />
    </div>
  );
}
