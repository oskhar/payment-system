import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string(),
  uid_card: z.string().nullable().optional(),
});
export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>;
