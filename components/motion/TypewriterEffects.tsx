"use client";

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  delay?: number;
  cursor?: boolean;
  cursorChar?: string;
  onComplete?: () => void;
  triggerOnView?: boolean;
}

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
  cursor = true,
  cursorChar = '|',
  onComplete,
  triggerOnView = true,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (triggerOnView && !isInView) return;
    if (hasStarted) return;

    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [isInView, triggerOnView, delay, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed, onComplete]);

  return (
    <span ref={ref} className={cn('inline', className)}>
      {displayedText}
      {cursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="inline-block ml-0.5">
          {cursorChar}
        </motion.span>
      )}
    </span>
  );
}

// Multi-line typewriter with line-by-line animation
interface TypewriterLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  speed?: number;
  lineDelay?: number;
  cursor?: boolean;
}

export function TypewriterLines({
  lines,
  className,
  lineClassName,
  speed = 50,
  lineDelay = 500,
  cursor = true,
}: TypewriterLinesProps) {
  const [currentLine, setCurrentLine] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const handleLineComplete = () => {
    setCompletedLines((prev) => [...prev, lines[currentLine]]);
    setTimeout(() => {
      if (currentLine < lines.length - 1) {
        setCurrentLine((prev) => prev + 1);
      }
    }, lineDelay);
  };

  return (
    <div ref={ref} className={className}>
      {completedLines.map((line, index) => (
        <div key={index} className={lineClassName}>
          {line}
        </div>
      ))}
      {isInView && currentLine < lines.length && (
        <div className={lineClassName}>
          <TypewriterText
            text={lines[currentLine]}
            speed={speed}
            cursor={cursor && currentLine === lines.length - 1}
            onComplete={handleLineComplete}
            triggerOnView={false}
          />
        </div>
      )}
    </div>
  );
}

// Typewriter with delete and retype effect
interface TypewriterLoopProps {
  texts: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  cursor?: boolean;
}

export function TypewriterLoop({
  texts,
  className,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
  cursor = true,
}: TypewriterLoopProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < currentText.length) {
            setDisplayedText(currentText.slice(0, displayedText.length + 1));
          } else {
            setIsPaused(true);
          }
        } else {
          if (displayedText.length > 0) {
            setDisplayedText(displayedText.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? deleteSpeed : typeSpeed
    );

    return () => clearTimeout(timeout);
  }, [
    displayedText,
    currentIndex,
    isDeleting,
    isPaused,
    texts,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return (
    <span className={cn('inline', className)}>
      {displayedText}
      {cursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="inline-block ml-0.5">
          |
        </motion.span>
      )}
    </span>
  );
}

// Scramble text effect
interface ScrambleTextProps {
  text: string;
  className?: string;
  speed?: number;
  revealSpeed?: number;
  characters?: string;
  triggerOnView?: boolean;
}

export function ScrambleText({
  text,
  className,
  speed = 30,
  revealSpeed = 80,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
  triggerOnView = true,
}: ScrambleTextProps) {
  const [displayedText, setDisplayedText] = useState(text.replace(/./g, ' '));
  const [revealedCount, setRevealedCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (triggerOnView && !isInView) return;
    if (hasStarted) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasStarted(true);
  }, [isInView, triggerOnView, hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    // Scramble effect
    const scrambleInterval = setInterval(() => {
      setDisplayedText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (index < revealedCount) return text[index];
            if (char === ' ') return ' ';
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });
    }, speed);

    // Reveal characters progressively
    const revealInterval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= text.length) {
          clearInterval(scrambleInterval);
          clearInterval(revealInterval);
          return prev;
        }
        return prev + 1;
      });
    }, revealSpeed);

    return () => {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
    };
  }, [hasStarted, text, speed, revealSpeed, characters, revealedCount]);

  return (
    <span ref={ref} className={cn('inline font-mono', className)}>
      {displayedText}
    </span>
  );
}

// Gradient text reveal
interface GradientRevealTextProps {
  text: string;
  className?: string;
  duration?: number;
  delay?: number;
}

export function GradientRevealText({
  text,
  className,
  duration = 1,
  delay = 0,
}: GradientRevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <span ref={ref} className={cn('inline-block relative', className)}>
      <span className="opacity-20">{text}</span>
      <motion.span
        className="absolute inset-0 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={isInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ WebkitBackgroundClip: 'text' }}>
        {text}
      </motion.span>
    </span>
  );
}
