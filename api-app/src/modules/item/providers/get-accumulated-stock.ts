import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionTypeEnum } from '../../stock/enums/transaction-type.enum';
import { Stock } from 'src/modules/stock/entities/stock.entity';

@Injectable()
export class GetAccumulatedStock {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
  ) {}

  async execute(itemId: number): Promise<number> {
    const stockIn = await this.stockRepository.find({
      where: {
        item: { id: itemId },
        type: TransactionTypeEnum.STOCK_IN,
      },
    });

    const stockOut = await this.stockRepository.find({
      where: {
        item: { id: itemId },
        type: TransactionTypeEnum.STOCK_OUT,
      },
    });

    return (
      stockIn
        .map((row) => row.quantity)
        .reduce((sum, quantity) => sum + quantity, 0) -
      stockOut
        .map((row) => row.quantity)
        .reduce((sum, quantity) => sum + quantity, 0)
    );
  }
}
