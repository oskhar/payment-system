import { z } from 'zod';

export const CreateTopUpBalanceSchema = z.object({
  customer_id: z.array(z.number()),
  nominal: z.number(),
});
export type CreateTopUpBalanceDto = z.infer<typeof CreateTopUpBalanceSchema>;
