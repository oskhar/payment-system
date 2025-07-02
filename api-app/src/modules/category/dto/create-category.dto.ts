import z from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;
