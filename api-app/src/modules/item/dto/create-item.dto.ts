import { z } from 'zod';

export const CreateItemSchema = z.object({
  name: z.string(),
  categories: z.string(),
  price: z.preprocess((val) => {
    if (typeof val === 'string') {
      const parsed = Number(val);
      if (isNaN(parsed)) {
        throw new Error('Price harus berupa angka yang valid');
      }
      return parsed;
    }
    return val;
  }, z.number()),

  image_url: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;
