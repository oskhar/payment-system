import { Test, TestingModule } from '@nestjs/testing';
import { ImageUploadProvider } from './image-upload-provider';

describe('ImageUploadProvider', () => {
  let provider: ImageUploadProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageUploadProvider],
    }).compile();

    provider = module.get<ImageUploadProvider>(ImageUploadProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
