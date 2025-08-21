import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { MulterConfigModule } from './config/multer/multer-config.module';
import { CategoryModule } from './domain/product/category/category.module';
import { ItemModule } from './domain/product/item/item.module';
import { UnitModule } from './domain/product/unit/unit.module';
import { StatusSystemController } from './status-system/status-system.controller';
import { StockModule } from './domain/inventory/stock/stock.module';
import { BranchModule } from './domain/inventory/branch/branch.module';
import { TransactionModule } from './domain/sales/transaction/transaction.module';
import { UserModule } from './domain/sales/user/user.module';
import { AuthModule } from './domain/sales/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MulterConfigModule,
    CategoryModule,
    ItemModule,
    UnitModule,
    StockModule,
    BranchModule,
    TransactionModule,
    UserModule,
    AuthModule,
  ],
  controllers: [StatusSystemController],
  providers: [],
})
export class AppModule {}
