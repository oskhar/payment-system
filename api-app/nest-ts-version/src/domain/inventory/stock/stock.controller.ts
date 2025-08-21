import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, CreateStockSchema } from './dto/create-stock.dto';
import { ValidatePipe } from 'src/common/pipes/validate.pipe';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/filter-data.dto';
import { IdsSchema } from 'src/common/api/dto/ids.dto';
import { JwtAuthGuard } from 'src/domain/sales/auth/guards/jwt-auth.guard';
import { User } from 'src/modules/user/entities/user.entity';
import { GetUser } from 'src/domain/sales/auth/decorator/get-user.decorator';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @GetUser() user: User,
    @Body(new ValidatePipe(CreateStockSchema)) createStockDto: CreateStockDto,
  ) {
    return this.stockService.create(user.id, createStockDto);
  }

  @Get()
  findAll(
    @Query(new ValidatePipe(FilterDataSchema)) filterData: FilterDataDto,
  ) {
    return this.stockService.findAll(filterData);
  }

  @Delete()
  remove(@Body(new ValidatePipe(IdsSchema)) body: { ids: number[] }) {
    return this.stockService.remove(body.ids);
  }
}
