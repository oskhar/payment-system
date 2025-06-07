import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { GetAccumulatedBalance } from './provider/get-accumulated-balance';
import { RfidGateway } from './gateway/rfid.gateway';
import { TopUpBalance } from '../top-up-balance/entities/top-up-balance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, TopUpBalance])],
  controllers: [CustomerController],
  providers: [CustomerService, GetAccumulatedBalance, RfidGateway],
  exports: [RfidGateway],
})
export class CustomerModule {}
