import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll(filterData: FilterDataDto) {
    const { page, limit, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';
    return await this.categoryRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      where: { name: ILike(`%${cleanSearch}%`) },
      order: sort_by ? { [sort_by]: sort_type } : undefined,
    });
  }

  async remove(ids: number[]) {
    for (const id of ids) {
      const category = await this.categoryRepository.findOneBy({ id });
      if (!category) {
        throw new Error('Category not found');
      }
      await this.categoryRepository.delete(id);
    }
  }
}
