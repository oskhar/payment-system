import { Injectable, BadRequestException } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ImageUploadProvider {
  private readonly allowedFormats = ['image/png', 'image/jpg', 'image/jpeg'];
  private readonly maxSize = 5 * 1024 * 1024;

  private imageSchema = z.object({
    mimetype: z.string().refine((type) => this.allowedFormats.includes(type), {
      message:
        'Format gambar tidak valid. Hanya PNG, JPG, dan JPEG yang diperbolehkan.',
    }),
    size: z.number().max(this.maxSize, 'Ukuran file maksimal 5MB'),
  });

  validateImage(file: Express.Multer.File): void {
    const validation = this.imageSchema.safeParse(file);
    if (!validation.success) {
      throw new BadRequestException(
        validation.error.issues.map((issue) => issue.message).join(', '),
      );
    }
  }

  uploadImage(file: Express.Multer.File): string {
    this.validateImage(file);
    return `/uploads/image/${file.filename}`;
  }
}
