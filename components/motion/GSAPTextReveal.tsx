import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

interface GSAPTextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
}

export const GSAPTextReveal = ({
  text,
  className,
  delay = 0,
  duration = 0.8,
  stagger = 0.03,
}: GSAPTextRevealProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split text process (simple version without SplitText plugin which is paid)
      // We rely on the DOM structure created in render
      const chars = containerRef.current?.querySelectorAll('.char');

      if (chars && chars.length > 0) {
        gsap.fromTo(
          chars,
          {
            y: 50,
            opacity: 0,
            rotateX: -45,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: duration,
            stagger: stagger,
            delay: delay,
            ease: 'back.out(1.7)',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [text, delay, duration, stagger]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden inline-block leading-tight', className)}
      aria-label={text}>
      {text.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="char inline-block transform-style-3d origin-center"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};
