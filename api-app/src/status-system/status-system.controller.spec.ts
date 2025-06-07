import { Test, TestingModule } from '@nestjs/testing';
import { StatusSystemController } from './status-system.controller';

describe('StatusSystemController', () => {
  let controller: StatusSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusSystemController],
    }).compile();

    controller = module.get<StatusSystemController>(StatusSystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
