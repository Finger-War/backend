import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { SocketIoAdapter } from '@/main/adapters/socket-io-adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(4000);
}
bootstrap();
