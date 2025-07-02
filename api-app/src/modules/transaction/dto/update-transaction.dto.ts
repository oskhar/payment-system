import { z } from 'zod';
import { CreateTransactionSchema } from './create-transaction.dto';

export const UpdateTransactionSchema = CreateTransactionSchema;

export type UpdateTransactionDto = z.infer<typeof UpdateTransactionSchema>;
