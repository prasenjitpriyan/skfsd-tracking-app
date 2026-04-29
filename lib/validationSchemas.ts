import { z } from 'zod';

const nonNegativeInt = z
  .number()
  .int()
  .min(0, 'Must be 0 or greater')
  .optional();

const nonNegativeDecimal = z.number().min(0, 'Must be 0 or greater').optional();

const uuid = z.string().uuid('Invalid ID format');

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format');

export const dailyOfficeDataSchema = z.object({
  office_id: uuid,
  date: dateString,
  account_open: nonNegativeInt,
  account_close: nonNegativeInt,
  mail_bookings: nonNegativeInt,
  mail_amount: nonNegativeDecimal,
  ippb_account_open: nonNegativeInt,
  ippb_premium_account_open: nonNegativeInt,
  gi_insurance: nonNegativeInt,
  new_policy_indexed: nonNegativeInt,
  sum_assured: nonNegativeDecimal,
  first_year_premium: nonNegativeDecimal,
  renewal_premium: nonNegativeDecimal,
  aadhaar_transactions: nonNegativeInt,
  aadhaar_amount: nonNegativeDecimal,
  mystamp_procurement: nonNegativeInt,
});

export type DailyOfficeDataInput = z.infer<typeof dailyOfficeDataSchema>;

export const dailyDeliveryDataSchema = z.object({
  delivery_centre_id: uuid,
  date: dateString,
  mail_received: nonNegativeInt,
  mail_delivered: nonNegativeInt,
});

export type DailyDeliveryDataInput = z.infer<typeof dailyDeliveryDataSchema>;

export const officeTargetSchema = z.object({
  office_id: uuid,
  financial_year_id: uuid,
  account_open_target: nonNegativeInt,
  net_account_target: nonNegativeInt,
  mail_booking_target: nonNegativeInt,
  mail_amount_target: nonNegativeDecimal,
  ippb_account_target: nonNegativeInt,
  ippb_premium_target: nonNegativeInt,
  gi_insurance_target: nonNegativeInt,
  new_policy_target: nonNegativeInt,
  sum_assured_target: nonNegativeDecimal,
  first_year_premium_target: nonNegativeDecimal,
  renewal_premium_target: nonNegativeDecimal,
  aadhaar_transactions_target: nonNegativeInt,
  aadhaar_amount_target: nonNegativeDecimal,
  mystamp_target: nonNegativeInt,
});

export type OfficeTargetInput = z.infer<typeof officeTargetSchema>;

export const officeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  office_code: z
    .string()
    .trim()
    .max(20, 'Code must be 20 characters or less')
    .optional(),
});

export type OfficeInput = z.infer<typeof officeSchema>;

export const deliveryCentreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less'),
  centre_code: z
    .string()
    .trim()
    .max(20, 'Code must be 20 characters or less')
    .optional(),
});

export type DeliveryCentreInput = z.infer<typeof deliveryCentreSchema>;

export const financialYearSchema = z
  .object({
    year_name: z
      .string()
      .trim()
      .min(1, 'Year name is required')
      .max(50, 'Year name must be 50 characters or less'),
    start_date: dateString,
    end_date: dateString,
    is_active: z.boolean().optional(),
  })
  .refine((data) => new Date(data.end_date) > new Date(data.start_date), {
    message: 'End date must be after start date',
    path: ['end_date'],
  });

export type FinancialYearInput = z.infer<typeof financialYearSchema>;

export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.issues[0];
    throw new Error(firstError?.message || 'Validation failed');
  }
  return result.data;
}
