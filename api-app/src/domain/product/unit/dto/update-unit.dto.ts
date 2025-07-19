import z from 'zod';
import { CreateUnitSchema } from './create-unit.dto';

export const UpdateUnitSchema = CreateUnitSchema;
export type UpdateUnitDto = z.infer<typeof UpdateUnitSchema>;
