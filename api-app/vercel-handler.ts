import { createServer, proxy } from 'aws-serverless-express';
import { Handler, Context, Callback } from 'aws-lambda';
import { app } from './src/main';

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const nestApp = await app();
    await nestApp.init();
    const expressApp = nestApp.getHttpAdapter().getInstance();
    cachedServer = createServer(expressApp);
  }
  return cachedServer;
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  cachedServer = await bootstrapServer();
  return proxy(cachedServer, event, context, 'PROMISE').promise;
};
