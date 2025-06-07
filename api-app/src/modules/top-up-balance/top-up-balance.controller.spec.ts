import { Test, TestingModule } from '@nestjs/testing';
import { TopUpBalanceController } from './top-up-balance.controller';
import { TopUpBalanceService } from './top-up-balance.service';

describe('TopUpBalanceController', () => {
  let controller: TopUpBalanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopUpBalanceController],
      providers: [TopUpBalanceService],
    }).compile();

    controller = module.get<TopUpBalanceController>(TopUpBalanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
