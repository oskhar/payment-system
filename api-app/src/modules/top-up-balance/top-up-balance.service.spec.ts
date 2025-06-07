import { Test, TestingModule } from '@nestjs/testing';
import { TopUpBalanceService } from './top-up-balance.service';

describe('TopUpBalanceService', () => {
  let service: TopUpBalanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TopUpBalanceService],
    }).compile();

    service = module.get<TopUpBalanceService>(TopUpBalanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
