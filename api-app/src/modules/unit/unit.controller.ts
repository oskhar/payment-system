import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { UnitService } from './unit.service';
import { CreateUnitDto, CreateUnitSchema } from './dto/create-unit.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { IdsDto, IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('unit')
export class UnitController {
  constructor(private readonly unitService: UnitService) {}

  @Post()
  create(@Body(new ZodPipe(CreateUnitSchema)) createUnitDto: CreateUnitDto) {
    return this.unitService.create(createUnitDto);
  }

  @Get()
  findAll() {
    return this.unitService.findAll();
  }

  @Delete()
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.unitService.remove(ids);
  }
}
