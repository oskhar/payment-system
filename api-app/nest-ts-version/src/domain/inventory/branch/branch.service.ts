import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { ILike, Repository } from 'typeorm';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto) {
    const branch = this.branchRepository.create(createBranchDto);
    return await this.branchRepository.save(branch);
  }

  async findAll(filterData: FilterDataDto) {
    const { page, limit, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';
    const [branches, total] = await this.branchRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { name: ILike(`%${cleanSearch}%`) },
      order: sort_by ? { [sort_by]: sort_type } : undefined,
    });
    console.log(await this.branchRepository.find());

    const createUrl = (page: number) =>
      `?search=${search || ''}&limit=${limit}&page=${page}&sort_by=${sort_by}&sort_type=${sort_type}`;

    return {
      branches,
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

  async findOne(id: number) {
    return await this.branchRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.findOneBy({ id });
    if (!branch) {
      throw new Error('Branch not found');
    }
    await this.branchRepository.update(id, updateBranchDto);
  }

  async remove(ids: number[]) {
    for (const id of ids) {
      const branch = await this.branchRepository.findOneBy({ id });
      if (!branch) {
        throw new UnprocessableEntityException('Branch not found');
      }
      await this.branchRepository.delete(id);
    }
  }
}
