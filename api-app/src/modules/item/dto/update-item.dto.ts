import { z } from 'zod';
import { CreateItemSchema } from './create-item.dto';

export const UpdateItemSchema = CreateItemSchema;
export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
