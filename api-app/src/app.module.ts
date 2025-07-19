import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './config/database/database.module';
import { MulterConfigModule } from './config/multer/multer-config.module';
import { CategoryModule } from './domain/product/category/category.module';
import { ItemModule } from './domain/product/item/item.module';
import { UnitModule } from './domain/product/unit/unit.module';
import { StatusSystemController } from './status-system/status-system.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MulterConfigModule,
    CategoryModule,
    ItemModule,
    UnitModule,
  ],
  controllers: [StatusSystemController],
  providers: [],
})
export class AppModule {}
