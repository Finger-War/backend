import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { envs } from '@/main/config/envs';
import { Server, Socket } from 'socket.io';

export interface IGameGateway {
  handleConnection(client: Socket): void;
  handleDisconnect(client: Socket): void;
}

@WebSocketGateway({ cors: true, port: envs.WS_PORT })
export class GameGateway implements IGameGateway {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(private readonly joinGameQueueUseCase: JoingGameQueueUseCase) {}

  handleConnection(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Number of connected clients: ${sockets.size}`);
    this.logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage('join-queue')
  handleStart(client: Socket): void {
    Logger.debug(`Client ${client.id} joined the queue`);

    this.joinGameQueueUseCase.execute(client.id);
  }
}
