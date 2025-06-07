import { Module } from '@nestjs/common';
import { TopUpBalanceService } from './top-up-balance.service';
import { TopUpBalanceController } from './top-up-balance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopUpBalance } from './entities/top-up-balance.entity';
import { Customer } from '../customer/entities/customer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TopUpBalance, Customer])],
  controllers: [TopUpBalanceController],
  providers: [TopUpBalanceService],
})
export class TopUpBalanceModule {}
