import { Module } from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { StockInController } from './stock-in.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockIn } from './entities/stock-in.entity';
import { StockInItem } from './entities/stock-in-item.entity';
import { Item } from '../item/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StockIn, StockInItem, Item])],
  controllers: [StockInController],
  providers: [StockInService],
})
export class StockInModule {}
