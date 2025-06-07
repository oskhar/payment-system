import { Test, TestingModule } from '@nestjs/testing';
import { RfidGateway } from './rfid.gateway';

describe('RfidGateway', () => {
  let gateway: RfidGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RfidGateway],
    }).compile();

    gateway = module.get<RfidGateway>(RfidGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
