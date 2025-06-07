import { Test, TestingModule } from '@nestjs/testing';
import { StockInService } from './stock-in.service';

describe('StockInService', () => {
  let service: StockInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockInService],
    }).compile();

    service = module.get<StockInService>(StockInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
