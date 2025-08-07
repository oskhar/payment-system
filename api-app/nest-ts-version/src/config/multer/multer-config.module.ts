import { Module, Global } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ImageController } from './image/image.controller';

@Global()
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/image',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
          return cb(new Error('Format gambar tidak valid'), false);
        }
        cb(null, true);
      },
    }),
  ],
  exports: [MulterModule],
  controllers: [ImageController],
})
export class MulterConfigModule {}
