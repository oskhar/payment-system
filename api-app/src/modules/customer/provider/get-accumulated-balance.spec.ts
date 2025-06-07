import { Test, TestingModule } from '@nestjs/testing';
import { GetAccumulatedBalance } from './get-accumulated-balance';

describe('GetAccumulatedBalance', () => {
  let provider: GetAccumulatedBalance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetAccumulatedBalance],
    }).compile();

    provider = module.get<GetAccumulatedBalance>(GetAccumulatedBalance);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
