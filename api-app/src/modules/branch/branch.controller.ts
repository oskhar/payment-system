import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { ZodPipe } from 'src/common/pipes/zod.pipe';
import { IdsDto, IdsSchema } from 'src/common/api/dto/ids.dto';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) { }

  @Post()
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchService.create(createBranchDto);
  }

  @Get()
  findAll() {
    return this.branchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.branchService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchService.update(+id, updateBranchDto);
  }

  @Delete()
  remove(@Body(new ZodPipe(IdsSchema)) ids: IdsDto) {
    return this.branchService.remove(ids);
  }
}
