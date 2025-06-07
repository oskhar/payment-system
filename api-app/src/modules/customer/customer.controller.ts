import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import {
  CreateCustomerDto,
  CreateCustomerSchema,
} from './dto/create-customer.dto';
import {
  UpdateCustomerDto,
  UpdateCustomerSchema,
} from './dto/update-customer.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import {
  FilterDataSchema,
  FilterDataDto,
} from 'src/common/api/dto/pagination.dto';
import { IdsDto, IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(
    @Body(new ZodPipe(CreateCustomerSchema))
    createCustomerDto: CreateCustomerDto,
  ) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() filter: FilterDataDto, @Req() req: Request) {
    filter = FilterDataSchema.parse(filter);
    return this.customerService.findAll(filter, req.url);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateCustomerSchema))
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete()
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.customerService.remove(ids);
  }

  @Post('uid-scan/stop')
  stopScan() {
    this.customerService.stopScan();
  }

  @Post('uid-scan/:id')
  waitingScan(@Param('id') id: string) {
    this.customerService.waitingScan(+id);
  }

  @Post('uid-scan/rfid/:uid')
  rfidScan(@Param('uid') uid: string) {
    this.customerService.rfidScan(uid);
  }
}
