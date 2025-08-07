import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { Stock } from './entities/stock.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemUnit } from 'src/domain/product/item/entities/item-unit.entity';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';
import { codeGenerator } from 'src/common/api/utils/code-generator';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    @InjectRepository(ItemUnit)
    private readonly itemUnitRepository: Repository<ItemUnit>,
  ) {}

  async create(userId: number, createStockDto: CreateStockDto) {
    const isAutoTransactionNumber =
      createStockDto.transaction_number &&
      createStockDto.transaction_number.toLowerCase() == 'auto';

    const existDuplicateStock = await this.stockRepository.findOneBy({
      transaction_number: createStockDto.transaction_number,
    });

    if (existDuplicateStock && !isAutoTransactionNumber)
      throw new UnprocessableEntityException(
        'Nomor transaksi sudah digunakan, harap pilih yang lain',
      );

    /*
     * Generate nomor transaksi jika transaction_number
     * adalah auto
     */
    if (isAutoTransactionNumber) {
      const countStock = await this.stockRepository.count();
      createStockDto.transaction_number = codeGenerator('STK', countStock);
    }

    const itemUnit = await this.itemUnitRepository.findOne({
      where: {
        item: { id: createStockDto.item_id },
        unit: { id: createStockDto.unit_id },
      },
      relations: ['unit'],
    });

    if (!itemUnit) {
      throw new UnprocessableEntityException(
        'Unit tidak ditemukan, harap periksa inputan Anda',
      );
    }
    const finalQuantity =
      createStockDto.quantity_change * itemUnit.conversion_to_base;

    const stock = this.stockRepository.create({
      created_by: { id: userId },
      transaction_number: createStockDto.transaction_number,
      quantity_change: finalQuantity,
      type: createStockDto.type,
      description: createStockDto.description,
      branch: { id: createStockDto.branch_id },
      item: { id: createStockDto.item_id },
    });
    return await this.stockRepository.save(stock);
  }

  async findAll(filterData: FilterDataDto) {
    const { page = 1, limit = 10, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';
    const [stocks, total] = await this.stockRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where: { transaction_number: ILike(`%${cleanSearch}%`) },
      order: sort_by ? { [sort_by]: sort_type } : undefined,
    });

    const createUrl = (page: number) =>
      `?search=${search || ''}&limit=${limit}&page=${page}&sort_by=${sort_by}&sort_type=${sort_type}`;

    return {
      stocks,
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
      const stock = await this.stockRepository.findOneBy({ id });
      if (!stock) throw new UnprocessableEntityException('Stock not found');

      await this.stockRepository.delete(id);
    }
  }
}
