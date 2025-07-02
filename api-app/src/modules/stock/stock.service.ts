import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../item/entities/item.entity';
import { codeGenerator } from 'src/common/api/utils/code-generator';
import { IdsDto } from 'src/common/api/dto/ids.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) { }

  async create(id: number, createStockDto: CreateStockDto) {
    /*
     * Periksa apakah nomor transaksi sudah
     * digunakan sebelumnya
     */
    const isAutoTransactionNumber =
      createStockDto.transaction_number &&
      createStockDto.transaction_number.toLowerCase() == 'auto';

    const existDuplicateStock = await this.stockRepository.findOneBy({
      transaction_number: createStockDto.transaction_number,
    });

    if (existDuplicateStock && !isAutoTransactionNumber)
      throw new UnprocessableEntityException(
        'Transaction number Stock is already exist',
      );

    /*
     * Generate nomor transaksi jika transaction_number
     * adalah auto
     */
    if (isAutoTransactionNumber) {
      const countStock = await this.stockRepository.count();
      createStockDto.transaction_number = codeGenerator('SP', countStock);
    }

    await this.stockRepository.save(
      new Stock({ ...createStockDto, item: { id } }),
    );
  }

  async findAll() {
    const result = await this.stockRepository.find({
      relations: ['item'],
    });
    console.log(result);

    return {
      stock: result.map((row) => ({
        id: row.id,
        transaction_number: row.transaction_number,
        quantity: row.quantity,
        type: row.type,
        created_at: row.created_at,
      })),
    };
  }

  remove(ids: IdsDto) {
    for (const id of ids.ids) {
      const stock = this.stockRepository.findOneBy({ id });
      if (!stock) throw new UnprocessableEntityException('Stock not found');

      this.stockRepository.delete(id);
    }
  }
}
