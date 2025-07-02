import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateStockInDto } from './dto/create-stock-in.dto';
import { UpdateStockInDto } from './dto/update-stock-in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StockIn } from './entities/stock-in.entity';
import { Repository } from 'typeorm';
import { StockInItem } from './entities/stock-in-item.entity';
import { codeGenerator } from 'src/common/api/utils/code-generator';
import { Item } from '../item/entities/item.entity';

@Injectable()
export class StockInService {
  constructor(
    @InjectRepository(StockIn)
    private readonly stockInRepository: Repository<StockIn>,
    @InjectRepository(StockInItem)
    private readonly stockInItemRepository: Repository<StockInItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async create(createStockInDto: CreateStockInDto) {
    const isAutoTransactionNumber =
      createStockInDto.transaction_number &&
      createStockInDto.transaction_number.toLowerCase() == 'auto';

    const existDuplicateStockIn = await this.stockInRepository.findOneBy({
      transaction_number: createStockInDto.transaction_number,
    });

    if (existDuplicateStockIn && !isAutoTransactionNumber)
      throw new UnprocessableEntityException(
        'Transaction number Stock In already exist',
      );

    const countStockIn = await this.stockInRepository.count();
    if (isAutoTransactionNumber)
      createStockInDto.transaction_number = codeGenerator('SM', countStockIn);

    const newStockIn = await this.stockInRepository.save(
      new StockIn({ ...createStockInDto, stock_in_items: [] }),
    );

    for (const row of createStockInDto.stock_in_items) {
      const existItem = await this.itemRepository.findOneBy({
        id: row.item_id,
      });
      if (!existItem)
        throw new UnprocessableEntityException('Item selected no was found');

      await this.stockInItemRepository.save(
        new StockInItem({
          stock_in_id: newStockIn.id,
          item_id: row.item_id,
          quantity: row.quantity,
        }),
      );
    }
  }

  async findAll() {
    const result = await this.stockInRepository.find({
      relations: ['stock_in_items', 'stock_in_items.item'],
    });

    return {
      stock_in: result.map((row) => ({
        id: row.id,
        transaction_number: row.transaction_number,
        quantity: row.stock_in_items
          .map((item) => item.quantity)
          .reduce((sum, quantity) => sum + quantity, 0),
        created_at: row.created_at,
      })),
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} stockIn`;
  }

  update(id: number, updateStockInDto: UpdateStockInDto) {
    return `This action updates a #${id} stockIn`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockIn`;
  }
}
