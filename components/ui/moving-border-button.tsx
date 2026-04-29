import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';

interface MovingBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
}

export function MovingBorderButton({
  borderRadius = '0.5rem',
  children,
  as: Component = 'button',
  containerClassName,
  borderClassName,
  duration = 2000,
  className,
  ...otherProps
}: MovingBorderButtonProps) {
  return (
    <Component
      className={cn(
        'bg-transparent relative text-xl  p-[1px] overflow-hidden ',
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
      {...otherProps}>
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}>
        <motion.div
          animate={{
            rotate: 360,
          }}
          style={{
            borderRadius: `calc(${borderRadius} * 0.96)`,
          }}
          transition={{
            duration: duration / 1000, // framer motion uses seconds
            repeat: Infinity,
            ease: 'linear',
          }}
          className={cn(
            'absolute inset-0 bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-[0.8]',
            borderClassName
          )}
        />
      </div>

      <div
        className={cn(
          'relative bg-slate-900/[0.8] border border-slate-800 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased',
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}>
        {children}
      </div>
    </Component>
  );
}
