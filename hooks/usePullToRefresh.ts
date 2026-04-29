import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UsePullToRefreshOptions {
  /** Query keys to invalidate on refresh */
  queryKeys?: string[][];
  /** Custom refresh function (called in addition to query invalidation) */
  onRefresh?: () => Promise<void>;
  /** Minimum pull distance to trigger refresh (px) */
  threshold?: number;
  /** Maximum pull distance (px) */
  maxPull?: number;
}

export function usePullToRefresh({
  queryKeys = [],
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: UsePullToRefreshOptions = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const queryClient = useQueryClient();

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (isRefreshing) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop <= 0) {
        startY.current = e.touches[0].clientY;
        isPulling.current = true;
      }
    },
    [isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        // Apply resistance curve
        const distance = Math.min(diff * 0.5, maxPull);
        setPullDistance(distance);
      } else {
        isPulling.current = false;
        setPullDistance(0);
      }
    },
    [isRefreshing, maxPull]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling.current) return;
    isPulling.current = false;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      setPullDistance(threshold * 0.5); // Snap to spinner position

      try {
        // Invalidate all specified query keys
        await Promise.all(
          queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: key }))
        );
        if (onRefresh) await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, queryKeys, queryClient, onRefresh]);

  const progress = Math.min(pullDistance / threshold, 1);

  return {
    pullDistance,
    isRefreshing,
    progress,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
