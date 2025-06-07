import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TopUpBalanceService } from './top-up-balance.service';
import { CreateTopUpBalanceDto } from './dto/create-top-up-balance.dto';

@Controller('top-up-balance')
export class TopUpBalanceController {
  constructor(private readonly topUpBalanceService: TopUpBalanceService) {}

  @Post()
  create(@Body() createTopUpBalanceDto: CreateTopUpBalanceDto) {
    return this.topUpBalanceService.create(createTopUpBalanceDto);
  }

  @Get()
  findAll() {
    return this.topUpBalanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topUpBalanceService.findOne(+id);
  }

  @Delete()
  remove(@Body() ids: number[]) {
    return this.topUpBalanceService.remove(ids);
  }
}
