import { z } from 'zod';

// =================================================================
// Skema Dasar (Reusable) - Tidak ada perubahan di sini
// =================================================================

const ItemPriceSchema = z.object({
  id: z.coerce.number().optional(),
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

// Skema untuk validasi array kategori juga tetap sama
const CategoriesSchema = z.array(z.coerce.number());


// =================================================================
// Skema untuk UPDATE Item (Diperbaiki untuk Menangani Form-Data)
// =================================================================

export const UpdateItemSchema = z.object({
  name: z.string().min(1, 'Nama item tidak boleh kosong.').optional(),

  // PERBAIKAN: Gunakan z.preprocess untuk menangani string dari form-data
  categories: z.preprocess((val) => {
    // Jika data yang masuk adalah string, parse sebagai JSON.
    // Jika sudah array (misal dari request application/json), biarkan saja.
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        // Jika parsing gagal, kembalikan nilai asli agar Zod bisa 
        // melaporkan error "invalid_type" yang benar.
        return val;
      }
    }
    return val;
  }, CategoriesSchema) // Terapkan validasi CategoriesSchema setelah preprocessing
    .optional(),

  // PERBAIKAN: Gunakan z.preprocess untuk menangani array of objects
  item_prices: z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  }, z.array(ItemPriceSchema).min(1, 'Item harus memiliki setidaknya satu harga dasar.')) // Terapkan validasi array of ItemPriceSchema setelah preprocessing
    .optional(),

  // Field opsional lainnya
  barcode: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
});

export type UpdateItemDto = z.infer<typeof UpdateItemSchema>;
