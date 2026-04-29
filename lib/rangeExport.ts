import { supabase } from '@/integrations/supabase/runtime-client';
import { downloadCSV } from '@/lib/csvExport';
import { toast } from 'sonner';

export const exportOfficeDataRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('daily_office_data')
    .select('*, offices (id, name, office_code)')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('office_id');

  if (error) {
    toast.error('Failed to fetch data');
    return;
  }
  if (!data || data.length === 0) {
    toast.error('No data found for this date range');
    return;
  }

  const headers = ['Date', 'Office', 'Acc Open', 'Acc Close', 'Net', 'Mail Bookings', 'Mail Amount', 'IPPB Acc', 'IPPB Prem', 'GI', 'New Policy', 'Sum Assured', 'FYP', 'Renewal', 'Aadhaar Txn', 'Aadhaar Amt', 'MyStamp'];
  const rows = data.map((d: any) => [
    d.date,
    d.offices?.name || '',
    String(d.account_open || 0), String(d.account_close || 0),
    String(d.net_account_addition || 0), String(d.mail_bookings || 0), String(d.mail_amount || 0),
    String(d.ippb_account_open || 0), String(d.ippb_premium_account_open || 0),
    String(d.gi_insurance || 0), String(d.new_policy_indexed || 0), String(d.sum_assured || 0),
    String(d.first_year_premium || 0), String(d.renewal_premium || 0),
    String(d.aadhaar_transactions || 0), String(d.aadhaar_amount || 0), String(d.mystamp_procurement || 0),
  ]);
  downloadCSV(headers, rows, `office-data-${startDate}-to-${endDate}`);
};

export const exportDeliveryDataRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('daily_delivery_data')
    .select('*, delivery_centres (id, name, centre_code)')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date')
    .order('delivery_centre_id');

  if (error) {
    toast.error('Failed to fetch data');
    return;
  }
  if (!data || data.length === 0) {
    toast.error('No data found for this date range');
    return;
  }

  const headers = ['Date', 'Delivery Centre', 'Mail Received', 'Mail Delivered', 'Delivery %'];
  const rows = data.map((d: any) => [
    d.date,
    d.delivery_centres?.name || '',
    String(d.mail_received || 0),
    String(d.mail_delivered || 0),
    String(Number(d.delivery_percentage || 0).toFixed(1)),
  ]);
  downloadCSV(headers, rows, `delivery-data-${startDate}-to-${endDate}`);
};
