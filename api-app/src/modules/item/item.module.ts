import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ImageUploadProvider } from '../../config/multer/image/providers/image-upload.provider';
import { GetAccumulatedStock } from './providers/get-accumulated-stock';
import { ItemCategory } from './entities/item-category.entity';
import { Category } from '../category/entities/category.entity';
import { Stock } from '../stock/entities/stock.entity';
import { ItemPrices } from './entities/item-prices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, ItemCategory, Stock, ItemPrices])],
  controllers: [ItemController],
  providers: [ItemService, ImageUploadProvider, GetAccumulatedStock],
})
export class ItemModule { }
