import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, CreateItemSchema } from './dto/create-item.dto';
import { UpdateItemDto, UpdateItemSchema } from './dto/update-item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { IdsSchema } from 'src/common/api/dto/ids.dto';
import { IdsDto } from 'src/common/api/dto/ids.dto';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/pagination.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body(new ZodPipe(CreateItemSchema)) createItemDto: CreateItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.itemService.create(createItemDto, file);
  }

  @Get()
  findAll(@Query(new ZodPipe(FilterDataSchema)) filterData: FilterDataDto) {
    return this.itemService.findAll(filterData);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(+id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body(new ZodPipe(UpdateItemSchema)) updateItemDto: UpdateItemDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.itemService.update(+id, updateItemDto, file);
  }

  @Delete()
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.itemService.remove(ids);
  }
}
