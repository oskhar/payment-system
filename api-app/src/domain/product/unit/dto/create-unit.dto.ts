import z from 'zod';

export const CreateUnitSchema = z.object({
  name: z.string(),
  abbreviation: z.string(),
});

export type CreateUnitDto = z.infer<typeof CreateUnitSchema>;
