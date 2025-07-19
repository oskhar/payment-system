import z from 'zod';
import { RoleEnum } from '../enums/role.enum';

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  whatsapp: z.string(),
  role: z.nativeEnum(RoleEnum),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
