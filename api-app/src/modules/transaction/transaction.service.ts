import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import { codeGenerator } from 'src/common/api/utils/code-generator';
import { FilterDataDto } from 'src/common/api/dto/pagination.dto';
import { GetAccumulatedBalance } from '../customer/provider/get-accumulated-balance';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionItem)
    private readonly transactionItemRepository: Repository<TransactionItem>,
    private readonly getAccumulatedBalance: GetAccumulatedBalance,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    /*
     * Generate nomor transaksi jika transaction_number
     * adalah auto
     */
    const countTransaction = await this.transactionRepository.count();
    createTransactionDto.transaction_number = codeGenerator(
      'TP',
      countTransaction,
    );

    const newTransaction = await this.transactionRepository.save(
      new Transaction({
        ...createTransactionDto,
        transaction_items: [],
      }),
    );

    for (const row of createTransactionDto.transaction_items) {
      const existItem = await this.transactionRepository.findOneBy({
        id: row.item_id,
      });
      if (!existItem)
        throw new UnprocessableEntityException('Item selected no was found');

      await this.transactionItemRepository.save(
        new TransactionItem({
          transaction_id: newTransaction.id,
          item_id: row.item_id,
          quantity: row.quantity,
        }),
      );
    }
  }

  async findAll(filter: FilterDataDto, endpoint: string) {
    const whereClause = [];

    if (filter.search)
      whereClause.push({
        name: Like(`%${filter.search}%`),
      });

    const skip = (filter.page - 1) * filter.limit;

    const [transcations, total] = await this.transactionRepository.findAndCount(
      {
        where: whereClause,
        take: filter.limit,
        skip: skip,
        order: { [filter.sort_by]: filter.sort_type },
      },
    );

    const result = [];

    for (const transcation of transcations) {
      result.push({
        ...transcation,
        balance: await this.getAccumulatedBalance.execute(transcation.id),
      });
    }

    const createUrl = (page: number) =>
      `${endpoint}?search=${filter.search || ''}&limit=${filter.limit}&page=${page}&sort_by=${filter.sort_by}&sort_type=${filter.sort_type}`;

    return {
      transcations: result,
      pagination: {
        total,
        page: filter.page,
        limit: filter.limit,
        total_page: Math.ceil(total / filter.limit),
        links: {
          first: filter.page > 1 ? createUrl(1) : null,
          prev: filter.page > 1 ? createUrl(filter.page - 1) : null,
          next: filter.page < total ? createUrl(filter.page + 1) : null,
          last: filter.page < total ? createUrl(total) : null,
        },
      },
    };
  }

  async findOne(id: number) {
    const result = await this.transactionRepository.findOne({
      where: { id },
      relations: ['transaction_items'],
    });

    return {
      ...result,
      transaction_items: result.transaction_items.map((row) => ({
        id: row.item.id,
        name: row.item.name,
        quantity: row.quantity,
      })),
    };
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
