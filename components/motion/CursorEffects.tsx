import { cn } from '@/lib/utils';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface CursorTrailProps {
  className?: string;
  trailLength?: number;
  trailColor?: string;
  cursorSize?: number;
  trailSize?: number;
}

export function CursorTrail({
  className,
  trailLength = 8,
  trailColor = 'hsl(var(--primary))',
  cursorSize = 12,
  trailSize = 8,
}: CursorTrailProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring configuration for smooth following
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(hover: none)').matches || window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
    },
    [cursorX, cursorY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isMobile, handleMouseMove, handleMouseLeave, handleMouseEnter]);

  if (isMobile) return null;

  // Create trail dots with increasing delay
  const trailDots = Array.from({ length: trailLength }, (_, i) => {
    const delay = (i + 1) * 0.03;
    const size = trailSize * (1 - (i / trailLength) * 0.5);
    const opacity = 1 - (i / trailLength) * 0.8;

    return {
      delay,
      size,
      opacity,
    };
  });

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-9999', className)}>
      {/* Main cursor dot */}
      <motion.div
        className="fixed rounded-full pointer-events-none mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          width: cursorSize,
          height: cursorSize,
          backgroundColor: trailColor,
          translateX: -cursorSize / 2,
          translateY: -cursorSize / 2,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Trail dots */}
      {trailDots.map((dot, index) => (
        <TrailDot
          key={index}
          cursorX={cursorX}
          cursorY={cursorY}
          delay={dot.delay}
          size={dot.size}
          opacity={dot.opacity}
          color={trailColor}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}

interface TrailDotProps {
  cursorX: ReturnType<typeof useMotionValue<number>>;
  cursorY: ReturnType<typeof useMotionValue<number>>;
  delay: number;
  size: number;
  opacity: number;
  color: string;
  isVisible: boolean;
}

function TrailDot({
  cursorX,
  cursorY,
  delay,
  size,
  opacity,
  color,
  isVisible,
}: TrailDotProps) {
  const springConfig = {
    damping: 20 - delay * 100,
    stiffness: 200 - delay * 500,
  };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  return (
    <motion.div
      className="fixed rounded-full pointer-events-none"
      style={{
        x,
        y,
        width: size,
        height: size,
        backgroundColor: color,
        translateX: -size / 2,
        translateY: -size / 2,
        opacity: isVisible ? opacity : 0,
      }}
    />
  );
}

// Glow cursor variant
interface GlowCursorProps {
  className?: string;
  glowColor?: string;
  glowSize?: number;
}

export function GlowCursor({
  className,
  glowColor = 'hsl(var(--primary))',
  glowSize = 200,
}: GlowCursorProps) {
  const [isMobile, setIsMobile] = useState(true);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(hover: none)').matches || window.innerWidth < 768
      );
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile, cursorX, cursorY]);

  if (isMobile) return null;

  return (
    <motion.div
      className={cn(
        'fixed pointer-events-none z-9998 rounded-full blur-3xl',
        className
      )}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        width: glowSize,
        height: glowSize,
        background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        translateX: -glowSize / 2,
        translateY: -glowSize / 2,
        opacity: 0.15,
      }}
    />
  );
}

// Magnetic cursor effect for interactive elements
interface MagneticCursorAreaProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticCursorArea({
  children,
  className,
  strength = 0.3,
}: MagneticCursorAreaProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {children}
    </motion.div>
  );
}
