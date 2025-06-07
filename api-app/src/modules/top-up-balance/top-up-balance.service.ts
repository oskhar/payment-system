import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateTopUpBalanceDto } from './dto/create-top-up-balance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TopUpBalance } from './entities/top-up-balance.entity';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class TopUpBalanceService {
  constructor(
    @InjectRepository(TopUpBalance)
    private readonly topUpBalanceRepository: Repository<TopUpBalance>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createTopUpBalanceDto: CreateTopUpBalanceDto) {
    const topUpBalance: TopUpBalance[] = [];
    for (const id of createTopUpBalanceDto.customer_id) {
      const customer = await this.customerRepository.findOneBy({ id });

      if (!customer)
        throw new UnprocessableEntityException('Customer no was found');

      topUpBalance.push(
        new TopUpBalance({
          customer: { id },
          nominal: createTopUpBalanceDto.nominal,
        }),
      );
    }
    this.topUpBalanceRepository.save(topUpBalance);
  }

  async findAll() {
    const result = await this.topUpBalanceRepository.find({
      relations: ['customer'],
    });
    return {
      top_up_balances: result.map((row) => ({
        ...row,
        customer: { id: row.customer.id, name: row.customer.name },
      })),
    };
  }

  async findOne(id: number) {
    return await this.topUpBalanceRepository.findOne({
      where: {
        id,
      },
      relations: ['customer'],
    });
  }

  async remove(ids: number[]) {
    for (const id of ids) await this.topUpBalanceRepository.delete(id);
  }
}
