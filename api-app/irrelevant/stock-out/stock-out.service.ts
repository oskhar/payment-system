import { Injectable } from '@nestjs/common';
import { CreateStockOutDto } from './dto/create-stock-out.dto';
import { UpdateStockOutDto } from './dto/update-stock-out.dto';

@Injectable()
export class StockOutService {
  create(createStockOutDto: CreateStockOutDto) {
    return 'This action adds a new stockOut';
  }

  findAll() {
    return `This action returns all stockOut`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockOut`;
  }

  update(id: number, updateStockOutDto: UpdateStockOutDto) {
    return `This action updates a #${id} stockOut`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockOut`;
  }
}
