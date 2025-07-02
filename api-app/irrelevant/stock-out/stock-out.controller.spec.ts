import { Test, TestingModule } from '@nestjs/testing';
import { StockOutController } from './stock-out.controller';
import { StockOutService } from './stock-out.service';

describe('StockOutController', () => {
  let controller: StockOutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockOutController],
      providers: [StockOutService],
    }).compile();

    controller = module.get<StockOutController>(StockOutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
