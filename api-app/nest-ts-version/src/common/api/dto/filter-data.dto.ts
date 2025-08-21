import { z } from 'zod';
import { SortTypeEnum } from '../enums/sort-type.enum';

export const FilterDataSchema = z.object({
  search: z.string().optional(),

  // Gunakan z.coerce.number() untuk mengubah string dari query menjadi number
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),

  sort_by: z.string().optional(),
  sort_type: z.nativeEnum(SortTypeEnum).optional(),
});

export type FilterDataDto = z.infer<typeof FilterDataSchema>;
