import { Injectable } from '@nestjs/common';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { IdsDto } from 'src/common/api/dto/ids.dto';
import { Branch } from './entities/branch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) { }

  async create(createBranchDto: CreateBranchDto) {
    const branch = new Branch(createBranchDto);
    return await this.branchRepository.save(branch);
  }

  async findAll() {
    return await this.branchRepository.find();
  }

  async findOne(id: number) {
    return await this.branchRepository.findOneBy({ id });
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    const branch = await this.branchRepository.findOneBy({ id });
    if (!branch) throw new Error('Branch not found');
    Object.assign(branch, updateBranchDto);
    await this.branchRepository.save(branch);
  }

  async remove(ids: IdsDto) {
    for (const id of ids.ids) {
      const branch = await this.branchRepository.findOneBy({ id });
      if (!branch) throw new Error('Branch not found');
      await this.branchRepository.delete(id);
    }
  }
}
