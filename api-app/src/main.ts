import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/filter/error.filter';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import * as express from 'express';
import { join } from 'path';

export async function createApp() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new ErrorFilter());
  app.use(
    '/uploads/image',
    express.static(join(process.cwd(), 'uploads/image')),
  );
  return app;
}

if (require.main === module) {
  createApp().then((app) => app.listen(process.env.PORT ?? 3000));
}
