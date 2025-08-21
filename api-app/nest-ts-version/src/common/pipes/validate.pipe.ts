import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Injectable()
export class ValidatePipe implements PipeTransform {
  constructor(private readonly schema: any) {}

  transform(value: any, _metadata: ArgumentMetadata) {
    try {
      value = this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
          .join(', ');
        throw new BadRequestException(errorMessages);
      }

      throw error;
    }
    return value;
  }
}
