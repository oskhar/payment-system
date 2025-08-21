import z from 'zod';
import { StockTypeEnum } from '../enums/stock-type.enum';

export const CreateStockSchema = z.object({
  transaction_number: z.string().default('auto'),
  branch_id: z.coerce.number(),
  item_id: z.coerce.number(),
  unit_id: z.coerce.number(),
  quantity_change: z.coerce.number(),
  type: z.nativeEnum(StockTypeEnum),
  description: z.string().optional(),
});
export type CreateStockDto = z.infer<typeof CreateStockSchema>;
