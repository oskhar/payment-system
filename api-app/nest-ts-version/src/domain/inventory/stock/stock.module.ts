import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from './entities/stock.entity';
import { ItemUnit } from 'src/domain/product/item/entities/item-unit.entity';
import { Branch } from '../branch/entities/branch.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { GetAccumulatedStock } from './providers/get-accumulated-stock';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, ItemUnit, Branch, User])],
  controllers: [StockController],
  providers: [StockService, GetAccumulatedStock],
})
export class StockModule {}
