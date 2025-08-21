import { Controller } from '@nestjs/common';
import { Get } from '@nestjs/common';

@Controller('status-system')
export class StatusSystemController {
  @Get()
  getStatus() {
    return 'OK';
  }
}
