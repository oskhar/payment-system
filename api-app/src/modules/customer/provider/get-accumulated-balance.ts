import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopUpBalance } from 'src/modules/top-up-balance/entities/top-up-balance.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetAccumulatedBalance {
  constructor(
    @InjectRepository(TopUpBalance)
    private readonly topUpBalanceRepository: Repository<TopUpBalance>,
  ) {}

  async execute(customer_id: number) {
    const topUpBalances = await this.topUpBalanceRepository.findBy({
      customer: { id: customer_id },
    });
    return topUpBalances
      .map((row) => row.nominal)
      .reduce((sum, quantity) => sum + quantity, 0);
  }
}
