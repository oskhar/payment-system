import { z } from 'zod';
import { CreateStockInSchema } from './create-stock-in.dto';

export const UpdateStockInSchema = CreateStockInSchema.omit({
  transaction_number: true,
});
export type UpdateStockInDto = z.infer<typeof UpdateStockInSchema>;
