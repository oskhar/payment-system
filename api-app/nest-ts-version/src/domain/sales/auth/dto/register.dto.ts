import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
  confirm_password: z.string(),
  whatsapp: z.string().optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;
