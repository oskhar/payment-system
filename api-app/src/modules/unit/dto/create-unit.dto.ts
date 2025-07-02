import { z } from 'zod';

export const CreateUnitSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export type CreateUnitDto = z.infer<typeof CreateUnitSchema>;
