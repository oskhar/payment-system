import z from 'zod';

export const CreateUserSchema = z.object({
  name: z.string(),
  email: z.string(),
  whatsapp: z.string().optional(),
  password: z.string(),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;
