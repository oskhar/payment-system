import { z } from 'zod';

export const CreateStockInItemSchema = z.object({
  item_id: z.number(),
  quantity: z.number(),
});

export const CreateStockInSchema = z.object({
  transaction_number: z.string().default('auto'),
  description: z.string().optional().nullable(),
  stock_in_items: z.array(CreateStockInItemSchema),
});

export type CreateStockInDto = z.infer<typeof CreateStockInSchema>;
