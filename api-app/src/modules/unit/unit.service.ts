import { Injectable } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit } from './entities/unit.entity';
import { Repository } from 'typeorm';
import { IdsDto } from 'src/common/api/dto/ids.dto';

@Injectable()
export class UnitService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepository: Repository<Unit>,
  ) {}

  create(createUnitDto: CreateUnitDto) {
    const unit = new Unit(createUnitDto);
    return this.unitRepository.save(unit);
  }

  findAll() {
    return this.unitRepository.find();
  }

  remove(ids: IdsDto) {
    for (const id of ids.ids) {
      const unit = this.unitRepository.findOneBy({ id: +id });
      if (!unit) {
        console.warn(`Unit dengan ID ${id} tidak ditemukan dan dilewati.`);
        continue;
      }
      this.unitRepository.delete(+id);
    }
  }
}
