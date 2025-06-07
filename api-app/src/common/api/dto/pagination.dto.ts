import { z } from 'zod';
import { SortTypeEnum } from '../enums/sort-type.enum';

export const FilterDataSchema = z.object({
  search: z.string().optional(),
  page: z.number().default(1),
  limit: z.number().default(10),
  sort_by: z.string().optional(),
  sort_type: z.nativeEnum(SortTypeEnum).optional(),
});

export type FilterDataDto = z.infer<typeof FilterDataSchema>;
