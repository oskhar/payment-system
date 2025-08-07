import z from 'zod';
import { PaymentMethodEnum } from '../enums/patment-method.enum';

export const CreateTransactionSchema = z.object({
  transaction_number: z.string(),
  total_amount: z.coerce.number(),
  payment_method: z.nativeEnum(PaymentMethodEnum),
  branch_id: z.coerce.number(),
  item: z.array(
    z.object({
      unit_id: z.coerce.number(),
      item_id: z.coerce.number(),
      quantity: z.coerce.number(),
    }),
  ),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
