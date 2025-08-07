import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, CreateItemSchema } from './dto/create-item.dto';
import { UpdateItemDto, UpdateItemSchema } from './dto/update-item.dto';
import { ValidatePipe } from 'src/common/pipes/validate.pipe';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/filter-data.dto';
import { IdsSchema } from 'src/common/api/dto/ids.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ValidatePipe(CreateItemSchema)) createItemDto: CreateItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.itemService.create(createItemDto, file);
  }

  @Get()
  findAll(
    @Query(new ValidatePipe(FilterDataSchema)) filterData: FilterDataDto,
    @Query('branch_id') branchId?: string,
  ) {
    if (!branchId) {
      throw new BadRequestException('branch_id not found');
    }

    return this.itemService.findAll(parseInt(branchId), filterData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Get(':id/unit')
  findUnit(@Param('id') id: string) {
    return this.itemService.findUnit(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ValidatePipe(UpdateItemSchema)) updateItemDto: UpdateItemDto,
  ) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete()
  remove(@Body(new ValidatePipe(IdsSchema)) body: { ids: number[] }) {
    return this.itemService.remove(body.ids);
  }
}
