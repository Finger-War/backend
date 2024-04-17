import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { SocketIoAdapter } from '@/main/adapters/socket-io-adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const configService = app.get(ConfigService);
  const httpPort = configService.get<string>('HTTP_PORT');

  await app.listen(httpPort);

  Logger.log(`Server running at http://localhost:${httpPort}`);
}
bootstrap();
