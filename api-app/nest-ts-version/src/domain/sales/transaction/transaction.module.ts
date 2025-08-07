import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Branch } from 'src/domain/inventory/branch/entities/branch.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionItem } from './entities/transaction-item.entity';
import { Item } from 'src/domain/product/item/entities/item.entity';
import { Unit } from 'src/domain/product/unit/entities/unit.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TransactionEntity,
      User,
      Branch,
      TransactionItem,
      Item,
      Unit,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
