import { Test, TestingModule } from '@nestjs/testing';
import { GetAccumulatedStock } from './get-accumulated-stock';

describe('GetAccumulatedStock', () => {
  let provider: GetAccumulatedStock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAccumulatedStock],
    }).compile();

    provider = module.get<GetAccumulatedStock>(GetAccumulatedStock);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
