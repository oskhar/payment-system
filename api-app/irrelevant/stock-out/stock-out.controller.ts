import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockOutService } from './stock-out.service';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';

@Controller('stock-out')
export class StockOutController {
  constructor(private readonly stockOutService: StockOutService) {}

  @Post()
  create(@Body() createStockOutDto: CreateStockOutDto) {
    return this.stockOutService.create(createStockOutDto);
  }

  @Get()
  findAll() {
    return this.stockOutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockOutService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockOutDto: UpdateStockOutDto) {
    return this.stockOutService.update(+id, updateStockOutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockOutService.remove(+id);
  }
}
