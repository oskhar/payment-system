import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { codeGenerator } from 'src/common/api/utils/code-generator';
import { FilterDataDto } from 'src/common/api/dto/filter-data.dto';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const isAutoTransactionNumber =
      createTransactionDto.transaction_number &&
      createTransactionDto.transaction_number.toLowerCase() == 'auto';

    const existDuplicateStock = await this.transactionRepository.findOneBy({
      transaction_number: createTransactionDto.transaction_number,
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
      const countStock = await this.transactionRepository.count();
      createTransactionDto.transaction_number = codeGenerator('TS', countStock);
    }

    const transaction = this.transactionRepository.create({
      created_by: { id: userId },
      transaction_number: createTransactionDto.transaction_number,
      total_amount: createTransactionDto.total_amount,
      payment_method: createTransactionDto.payment_method,
      branch: { id: createTransactionDto.branch_id },
    });

    return await this.transactionRepository.save(transaction);
  }

  async findAll(filterData: FilterDataDto) {
    const { page = 1, limit = 10, search, sort_by, sort_type } = filterData;
    const cleanSearch = search ? search.trim() : '';
    const [transactions, total] = await this.transactionRepository.findAndCount(
      {
        skip: (page - 1) * limit,
        take: limit,
        where: { transaction_number: ILike(`%${cleanSearch}%`) },
        order: sort_by ? { [sort_by]: sort_type } : undefined,
      },
    );

    const createUrl = (page: number) =>
      `?search=${search || ''}&limit=${limit}&page=${page}&sort_by=${sort_by}&sort_type=${sort_type}`;

    return {
      transactions,
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
      const transaction = await this.transactionRepository.findOneBy({ id });
      if (!transaction)
        throw new UnprocessableEntityException('Transaction not found');

      await this.transactionRepository.delete(id);
    }
  }
}
