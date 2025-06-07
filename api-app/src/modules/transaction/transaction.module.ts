import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import { GetAccumulatedBalance } from '../customer/provider/get-accumulated-balance';
import { TopUpBalance } from '../top-up-balance/entities/top-up-balance.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, TransactionItem, TopUpBalance]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, GetAccumulatedBalance],
})
export class TransactionModule {}
