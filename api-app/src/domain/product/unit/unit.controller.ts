import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto, CreateUnitSchema } from './dto/create-unit.dto';
import { ValidatePipe } from 'src/common/pipes/validate.pipe';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/filter-data.dto';
import { IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  create(
    @Body(new ValidatePipe(CreateUnitSchema)) createUnitDto: CreateUnitDto,
  ) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  findAll(
    @Query(new ValidatePipe(FilterDataSchema)) filterData: FilterDataDto,
  ) {
    return this.unitService.findAll(filterData);
  }

  @Delete()
  remove(@Body(new ValidatePipe(IdsSchema)) body: { ids: number[] }) {
    return this.unitService.remove(body.ids);
  }
}
