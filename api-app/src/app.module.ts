import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './modules/item/item.module';
import { CustomerModule } from './modules/customer/customer.module';
import { TopUpBalanceModule } from './modules/top-up-balance/top-up-balance.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { MulterConfigModule } from './config/multer/multer-config.module';
import { ImageUploadProvider } from './config/multer/image/providers/image-upload.provider';
import { StockModule } from './modules/stock/stock.module';
import { CategoryModule } from './modules/category/category.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MulterConfigModule,
    ItemModule,
    CustomerModule,
    TopUpBalanceModule,
    TransactionModule,
    StockModule,
    CategoryModule,
    WarehouseModule,
  ],
  controllers: [],
  providers: [ImageUploadProvider],
})
export class AppModule {}
