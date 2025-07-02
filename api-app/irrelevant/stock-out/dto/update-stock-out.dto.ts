import { PartialType } from '@nestjs/mapped-types';
import { CreateStockOutDto } from './create-stock-out.dto';

export class UpdateStockOutDto extends PartialType(CreateStockOutDto) {}
