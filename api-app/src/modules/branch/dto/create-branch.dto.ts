import { z } from 'zod';

export const CreateBranchSchema = z.object({
  name: z.string(),
  address: z.string(),
  image_url: z.string().nullable(),
});

export type CreateBranchDto = z.infer<typeof CreateBranchSchema>;
