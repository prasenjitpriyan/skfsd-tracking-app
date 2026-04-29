import { cn } from '@/lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-md bg-muted',
        'before:absolute before:inset-0',
        'before:-translate-x-full before:animate-shimmer',
        'before:bg-linear-to-r before:from-transparent before:via-white/20 before:to-transparent',
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'p-6 bg-card border border-border rounded-lg space-y-4',
        className
      )}
      {...props}>
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}

function SkeletonStatCard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 bg-card border border-border rounded-lg', className)}
      {...props}>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

function SkeletonTable({
  rows = 5,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { rows?: number }) {
  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg overflow-hidden',
        className
      )}
      {...props}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-border bg-muted/30">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4 border-b border-border last:border-0">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

function SkeletonList({
  items = 3,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { items?: number }) {
  return (
    <div className={cn('space-y-4', className)} {...props}>
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

function SkeletonChart({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('p-6 bg-card border border-border rounded-lg', className)}
      {...props}>
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1 rounded-t-md"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-8" />
        ))}
      </div>
    </div>
  );
}

function SkeletonForm({
  fields = 4,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { fields?: number }) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-md" />
    </div>
  );
}

function SkeletonDashboard({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SkeletonChart />
        <SkeletonChart />
      </div>
    </div>
  );
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonChart,
  SkeletonDashboard,
  SkeletonForm,
  SkeletonList,
  SkeletonStatCard,
  SkeletonTable,
};
