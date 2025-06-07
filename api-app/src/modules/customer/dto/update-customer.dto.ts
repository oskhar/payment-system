import { z } from 'zod';
import { CreateCustomerSchema } from './create-customer.dto';

export const UpdateCustomerSchema = CreateCustomerSchema.and(z.object({}));
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>;
