import { format } from 'date-fns';
import { toast } from 'sonner';

export const downloadCSV = (
  headers: string[],
  rows: string[][],
  filename: string
) => {
  if (rows.length === 0) {
    toast.error('No data to export');
    return;
  }

  const escape = (val: string | number | null | undefined) => {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const csvContent = [
    headers.map(escape).join(','),
    ...rows.map((row) => row.map(escape).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  toast.success(`Exported ${rows.length} rows to CSV`);
};
