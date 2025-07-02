import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request_id = uuidv4();

    return next.handle().pipe(
      map((data) => ({
        status: true,
        message: 'Request processed successfully',
        data,
        meta: { request_id },
      })),
    );
  }
}
