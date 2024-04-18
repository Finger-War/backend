import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { SocketIoAdapter } from '@/main/adapters/socket-io-adapter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const configService = app.get(ConfigService);
  const httpPort = configService.get<string>('CONTAINER_PORT');

  await app.listen(httpPort, '0.0.0.0');

  Logger.log(`Server running at ${await app.getUrl()}`);
}
bootstrap();
