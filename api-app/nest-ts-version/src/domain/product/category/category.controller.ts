import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  CreateCategorySchema,
} from './dto/create-category.dto';
import { ValidatePipe } from 'src/common/pipes/validate.pipe';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/filter-data.dto';
import { IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body(new ValidatePipe(CreateCategorySchema))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query(new ValidatePipe(FilterDataSchema)) filterData: FilterDataDto,
  ) {
    return this.categoryService.findAll(filterData);
  }

  @Delete()
  remove(@Body(new ValidatePipe(IdsSchema)) body: { ids: number[] }) {
    return this.categoryService.remove(body.ids);
  }
}
