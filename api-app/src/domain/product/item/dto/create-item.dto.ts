import z from 'zod';

export const CreateItemSchema = z.object({
  unit: z.array(
    z.object({
      id: z.coerce.number(),
      price: z.coerce.number(),
      cost: z.coerce.number(),
      conversion_to_base: z.coerce.number(),
    }),
  ),
  category: z.array(
    z.object({
      id: z.coerce.number(),
    }),
  ),
  name: z.string(),
  barcode: z.string(),
  description: z.string().optional(),
  image_url: z.string().optional(),
  base_unit_id: z.coerce.number(),
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;
