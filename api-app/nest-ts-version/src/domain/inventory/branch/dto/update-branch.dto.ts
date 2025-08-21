import { CreateBranchSchema } from './create-branch.dto';
import z from 'zod';

export const UpdateBranchSchema = CreateBranchSchema;
export type UpdateBranchDto = z.infer<typeof UpdateBranchSchema>;
