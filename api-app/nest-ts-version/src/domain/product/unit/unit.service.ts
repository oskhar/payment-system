import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { Unit } from './entities/unit.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  async create(createUnitDto: CreateUnitDto) {
    const unit = this.unitRepository.create(createUnitDto);
    return await this.unitRepository.save(unit);
  }

  async findAll(filterData: FilterDataDto) {
    console.log(filterData);
    const { page = 1, limit = 10, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';

    const [units, total] = await this.unitRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { name: ILike(`%${cleanSearch}%`) },
    });

    const createUrl = (page: number) =>
      `?search=${search || ''}&limit=${limit}&page=${page}&sort_by=${sort_by}&sort_type=${sort_type}`;

    return {
      units,
      pagination: {
        total,
        page: page,
        limit: limit,
        total_page: Math.ceil(total / limit),
        links: {
          first: page > 1 ? createUrl(1) : null,
          prev: page > 1 ? createUrl(page - 1) : null,
          next: page < total ? createUrl(page + 1) : null,
          last: page < total ? createUrl(total) : null,
        },
      },
    };
  }

  async remove(ids: number[]) {
    for (const id of ids) {
      const unit = await this.unitRepository.findOneBy({ id });
      if (!unit) {
        throw new UnprocessableEntityException('Unit not found');
      }
      await this.unitRepository.delete(id);
    }
  }
}
