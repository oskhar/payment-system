import { z } from 'zod';
import { TransactionTypeEnum } from '../enums/transaction-type.enum';

export const CreateStockSchema = z.object({
  transaction_number: z.string().default('auto'),
  type: z.nativeEnum(TransactionTypeEnum),
  description: z.string().optional().nullable(),
  quantity: z.number(),
});

export type CreateStockDto = z.infer<typeof CreateStockSchema>;
