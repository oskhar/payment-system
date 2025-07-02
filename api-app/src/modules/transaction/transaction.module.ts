import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionItem } from './entities/transaction-item.entity';
import { Transaction } from './entities/transaction.entity';
import { Item } from '../item/entities/item.entity';
import { User } from '../user/entities/user.entity';
import { Branch } from '../branch/entities/branch.entity';
import { ItemPrices } from '../item/entities/item-prices.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, TransactionItem, Item, User, Branch, ItemPrices])],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
