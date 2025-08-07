import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto, CreateBranchSchema } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ValidatePipe } from 'src/common/pipes/validate.pipe';
import {
  FilterDataDto,
  FilterDataSchema,
} from 'src/common/api/dto/filter-data.dto';
import { JwtAuthGuard } from 'src/domain/sales/auth/guards/jwt-auth.guard';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(new ValidatePipe(CreateBranchSchema))
    createBranchDto: CreateBranchDto,
  ) {
    return this.branchService.create(createBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query(new ValidatePipe(FilterDataSchema)) filterData: FilterDataDto,
  ) {
    return this.branchService.findAll(filterData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  remove(@Body(new ValidatePipe(FilterDataSchema)) body: { ids: number[] }) {
    return this.branchService.remove(body.ids);
  }
}
