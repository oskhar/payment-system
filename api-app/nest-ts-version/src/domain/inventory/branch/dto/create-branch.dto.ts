import z from 'zod';

export const CreateBranchSchema = z.object({
  name: z.string(),
  address: z.string(),
});

export type CreateBranchDto = z.infer<typeof CreateBranchSchema>;
