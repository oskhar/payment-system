import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { IdsDto, IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('item')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post(':id/stock')
  create(@Param('id') id: string, @Body() createStockDto: CreateStockDto) {
    console.log(createStockDto);
    return this.stockService.create(+id, createStockDto);
  }

  @Get('stock')
  findAll() {
    return this.stockService.findAll();
  }

  @Delete('stock')
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.stockService.remove(ids);
  }
}
