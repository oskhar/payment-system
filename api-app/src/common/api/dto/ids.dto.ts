import z from 'zod';

export const IdsSchema = z.object({
  ids: z.array(z.coerce.number()),
});

export type IdsDto = z.infer<typeof IdsSchema>;
