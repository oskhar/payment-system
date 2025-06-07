import { Module } from '@nestjs/common';
import { StockOutService } from './stock-out.service';
import { StockOutController } from './stock-out.controller';

@Module({
  controllers: [StockOutController],
  providers: [StockOutService],
})
export class StockOutModule {}
