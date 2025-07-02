import { z } from 'zod';

// ===============================================================
// Skema untuk CREATE Item
// ===============================================================

const CreateItemPriceSchema = z.object({
  // z.coerce akan secara otomatis mengubah string di dalam JSON menjadi angka
  price: z.coerce
    .number({
      required_error: 'Harga wajib diisi.',
      invalid_type_error: 'Harga harus berupa angka.',
    })
    .positive('Harga harus lebih dari 0.'),

  min_quantity: z.coerce
    .number({
      required_error: 'Kuantitas minimum wajib diisi.',
      invalid_type_error: 'Kuantitas minimum harus berupa angka.',
    })
    .int('Kuantitas minimum harus berupa bilangan bulat.')
    .min(1, 'Kuantitas minimum adalah 1.'),
});

export const CreateItemSchema = z.object({
  name: z.string({
    required_error: 'Nama item wajib diisi.',
  }).min(1, 'Nama item tidak boleh kosong.'),

  // PERBAIKAN: Menggunakan .transform() dengan try...catch yang lebih kuat
  // untuk parsing dan validasi JSON string.
  categories: z.string({ required_error: 'Kategori wajib diisi.' }).transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      const arraySchema = z.array(z.coerce.number()).min(1, 'Item harus memiliki setidaknya satu kategori.');

      // Menggunakan .parse() yang akan melempar ZodError jika validasi gagal
      return arraySchema.parse(parsed);
    } catch (e) {
      // Menambahkan issue ke konteks Zod agar pesan error lebih jelas
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Format data kategori tidak valid. Pastikan formatnya adalah array angka dalam bentuk string JSON.',
      });
      return z.NEVER;
    }
  }),

  // Menerapkan pola yang sama untuk item_prices
  item_prices: z.string({ required_error: 'Data harga wajib diisi.' }).transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      const arraySchema = z.array(CreateItemPriceSchema).min(1, 'Item harus memiliki setidaknya satu harga dasar.');

      return arraySchema.parse(parsed);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Format data harga tidak valid (bukan JSON yang benar).',
      });
      return z.NEVER;
    }
  }),

  // Field opsional
  barcode: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type CreateItemDto = z.infer<typeof CreateItemSchema>;
