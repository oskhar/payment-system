import { Controller, Get, Post, Body, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { CreateCategorySchema } from './dto/create-category.dto';
import { IdsSchema } from 'src/common/api/dto/ids.dto';
import { IdsDto } from 'src/common/api/dto/ids.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateCategorySchema))
    createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Delete()
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.categoryService.remove(ids);
  }
}
