import { CreateItemSchema } from './create-item.dto';
import z from 'zod';

export const UpdateItemSchema = CreateItemSchema;
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
