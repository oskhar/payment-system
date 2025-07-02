import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { IdsDto } from 'src/common/api/dto/ids.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    const result = await this.categoryRepository.save(category);
    console.log(result);
    return result;
  }

  async findAll() {
    return this.categoryRepository.find();
  }

  async remove(data: IdsDto) {
    for (const id of data.ids) {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new UnprocessableEntityException('Category not found');
      }
      await await this.categoryRepository.delete(id);
    }
  }
}
