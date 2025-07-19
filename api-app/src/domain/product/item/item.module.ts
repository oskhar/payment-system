import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemCategory } from './entities/item-category.entity';
import { Unit } from '../unit/entities/unit.entity';
import { Category } from '../category/entities/category.entity';
import { ItemUnit } from './entities/item-unit.entity';
import { ImageUploadProvider } from 'src/config/multer/image/providers/image-upload.provider';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemCategory, Category, Unit, ItemUnit]),
  ],
  controllers: [ItemController],
  providers: [ItemService, ImageUploadProvider],
})
export class ItemModule {}
