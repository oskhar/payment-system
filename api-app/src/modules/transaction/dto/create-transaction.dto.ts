import { z } from 'zod';
import { PaymentMethodEnum } from '../enums/payment-method.enum';

export const CreateTransactionItemSchema = z.object({
  item_id: z.number(),
  quantity: z.number(),
});

export const CreateTransactionSchema = z.object({
  payment_method: z.nativeEnum(PaymentMethodEnum),
  transaction_items: z.array(CreateTransactionItemSchema),
});

export type CreateTransactionDto = z.infer<typeof CreateTransactionSchema>;
