import z from 'zod';

export const IdsSchema = z.object({
  ids: z.array(z.number()),
});

export type IdsDto = z.infer<typeof IdsSchema>;
