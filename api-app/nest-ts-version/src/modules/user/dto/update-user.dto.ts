import { z } from "zod";
import { CreateUserSchema } from "./create-user.dto";

export const UpdateUserSchema = CreateUserSchema;

export type UpdateUserDto = z.infer<typeof UpdateUserSchema>;
