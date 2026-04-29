import { cn } from '@/lib/utils';
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';

// Hook for getting scroll progress relative to an element
export function useParallax(offset: number = 0.5) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [offset * 100, offset * -100]
  );
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY, scrollYProgress };
}

// Parallax container component
interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
}

export function ParallaxSection({
  children,
  className,
  speed = 0.5,
  direction = 'up',
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const multiplier = direction === 'up' ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [speed * 100 * multiplier, speed * -100 * multiplier]
  );
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: smoothY }} className={className}>
      {children}
    </motion.div>
  );
}

// Parallax layer for backgrounds
interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  opacity?: [number, number];
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
  opacity = [1, 1],
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * 200, speed * -200]);
  const opacityValue = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [opacity[0], 1, opacity[1]]
  );
  const smoothY = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, opacity: opacityValue }}
      className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Parallax card with 3D tilt effect on scroll
interface ParallaxCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function ParallaxCard({
  children,
  className,
  index = 0,
}: ParallaxCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Staggered parallax based on index
  const baseOffset = (index % 4) * 10;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [50 + baseOffset, -50 - baseOffset]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [5, 0, -5]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{
        y: smoothY,
        scale: smoothScale,
        rotateX: smoothRotateX,
        transformPerspective: 1000,
      }}
      className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Hero parallax with multiple speed layers
interface HeroParallaxProps {
  children: ReactNode;
  className?: string;
}

export function HeroParallax({ children, className }: HeroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY, opacity, scale: smoothScale }}
      className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Floating parallax element
interface FloatingParallaxProps {
  children: ReactNode;
  className?: string;
  amplitude?: number;
  frequency?: number;
}

export function FloatingParallax({
  children,
  className,
  amplitude = 20,
  frequency = 3,
}: FloatingParallaxProps) {
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffsetY(Math.sin((Date.now() / 1000) * frequency) * amplitude);
    }, 16);

    return () => clearInterval(interval);
  }, [amplitude, frequency]);

  return (
    <motion.div
      animate={{ y: offsetY }}
      transition={{ type: 'tween', ease: 'linear' }}
      className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Depth parallax for creating layered depth effect
interface DepthLayerProps {
  children: ReactNode;
  className?: string;
  depth: number; // 0 = no parallax, 1 = maximum parallax
}

export function DepthLayer({ children, className, depth }: DepthLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 1], [0, depth * -500]);
  const smoothY = useSpring(y, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      ref={ref}
      style={{ y: smoothY }}
      className={cn('will-change-transform', className)}>
      {children}
    </motion.div>
  );
}

// Text reveal on scroll
interface TextRevealProps {
  children: string;
  className?: string;
}

export function TextReveal({ children, className }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  });

  const words = children.split(' ');

  return (
    <div ref={ref} className={cn('flex flex-wrap', className)}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return (
          <Word key={i} range={[start, end]} progress={scrollYProgress}>
            {word}
          </Word>
        );
      })}
    </div>
  );
}

interface WordProps {
  children: string;
  range: [number, number];
  progress: MotionValue<number>;
}

function Word({ children, range, progress }: WordProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);
  const y = useTransform(progress, range, [10, 0]);

  return (
    <motion.span style={{ opacity, y }} className="mr-2 inline-block">
      {children}
    </motion.span>
  );
}
