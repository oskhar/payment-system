import { createServer, proxy } from 'aws-serverless-express';
import type { Handler, Context, Callback } from 'aws-lambda';
import { createApp } from './src/main';

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const nestApp = await createApp();
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
  const server = await bootstrapServer();
  return proxy(server, event, context, 'PROMISE').promise;
};
