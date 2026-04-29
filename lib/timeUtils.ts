export const isAfterMidnight = (): boolean => {
  return false;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getTodayDate = (): string => {
  return formatDate(new Date());
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

export const calculatePercentage = (
  achieved: number,
  target: number
): number => {
  if (target === 0) return 0;
  return Math.round((achieved / target) * 100);
};

export const calculateProjected = (
  achieved: number,
  daysElapsed: number,
  totalDays: number
): number => {
  if (daysElapsed === 0) return 0;
  return Math.round((achieved / daysElapsed) * totalDays);
};
