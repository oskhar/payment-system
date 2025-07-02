import { Module } from '@nestjs/common';
import { DatabaseModule } from './config/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ItemModule } from './modules/item/item.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { MulterConfigModule } from './config/multer/multer-config.module';
import { ImageUploadProvider } from './config/multer/image/providers/image-upload.provider';
import { StockModule } from './modules/stock/stock.module';
import { CategoryModule } from './modules/category/category.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { StatusSystemController } from './status-system/status-system.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { BranchModule } from './modules/branch/branch.module';
import { UnitModule } from './modules/unit/unit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MulterConfigModule,
    ItemModule,
    TransactionModule,
    StockModule,
    CategoryModule,
    WarehouseModule,
    AuthModule,
    UserModule,
    BranchModule,
    UnitModule,
  ],
  controllers: [StatusSystemController],
  providers: [ImageUploadProvider],
})
export class AppModule {}
