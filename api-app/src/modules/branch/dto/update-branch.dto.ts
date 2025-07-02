import { z } from 'zod';
import { CreateBranchSchema } from './create-branch.dto';

export const UpdateBranchSchema = CreateBranchSchema;

export type UpdateBranchDto = z.infer<typeof UpdateBranchSchema>;
