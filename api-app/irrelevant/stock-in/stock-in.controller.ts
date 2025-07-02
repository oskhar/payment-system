import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StockInService } from './stock-in.service';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';

@Controller('stock-in')
export class StockInController {
  constructor(private readonly stockInService: StockInService) {}

  @Post()
  create(@Body() createStockInDto: CreateStockInDto) {
    return this.stockInService.create(createStockInDto);
  }

  @Get()
  findAll() {
    return this.stockInService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockInService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStockInDto: UpdateStockInDto) {
    return this.stockInService.update(+id, updateStockInDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockInService.remove(+id);
  }
}
