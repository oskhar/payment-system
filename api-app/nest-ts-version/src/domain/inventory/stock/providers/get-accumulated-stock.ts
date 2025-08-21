import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from '../entities/stock.entity';
import { StockTypeEnum } from '../enums/stock-type.enum';

@Injectable()
export class GetAccumulatedStock {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async execute(branchId: number, itemId: number): Promise<number> {
    const stockIn = await this.stockRepository.find({
      where: {
        item: { id: itemId },
        type: StockTypeEnum.IN,
        branch: { id: branchId },
      },
    });

    const stockOut = await this.stockRepository.find({
      where: {
        item: { id: itemId },
        type: StockTypeEnum.OUT,
        branch: { id: branchId },
      },
    });

    return (
      stockIn
        .map((row) => row.quantity_change)
        .reduce((sum, quantity) => sum + quantity, 0) -
      stockOut
        .map((row) => row.quantity_change)
        .reduce((sum, quantity) => sum + quantity, 0)
    );
  }
}
