import { Test, TestingModule } from '@nestjs/testing';
import { StockOutService } from './stock-out.service';

describe('StockOutService', () => {
  let service: StockOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockOutService],
    }).compile();

    service = module.get<StockOutService>(StockOutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
