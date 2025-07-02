import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/filter/error.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import * as express from 'express';
import { join } from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorFilter());

  app.use(
    '/uploads/image',
    express.static(join(process.cwd(), 'uploads/image')),
  );

  app.enableCors();
  app.useWebSocketAdapter(new IoAdapter(app));

  // await app.listen(process.env.PORT ?? 3000, '192.168.1.12');
  // await app.listen(process.env.PORT ?? 3000, '192.168.43.147');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
