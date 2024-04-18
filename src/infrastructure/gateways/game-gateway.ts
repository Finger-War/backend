import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { envs } from '@/main/config/envs';
import { GameConstants } from '@/main/constants/game-constants';
import { Server, Socket } from 'socket.io';

export interface IGameGateway {
  handleConnection(client: Socket): void;
  handleDisconnect(client: Socket): void;
}

@WebSocketGateway({ cors: true, port: envs.CONTAINER_PORT })
export class GameGateway implements IGameGateway {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly joinGameQueueUseCase: JoingGameQueueUseCase,
    private readonly getOutQueueUseCase: GetOutQueueUseCase,
  ) {}

  handleConnection(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.debug(`Number of connected clients: ${sockets.size}`);
    this.logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }

  @SubscribeMessage(GameConstants.server.joinQueue)
  handleJoinQueue(client: Socket): void {
    this.joinGameQueueUseCase.execute(client.id);
  }

  @SubscribeMessage(GameConstants.server.getOutQueue)
  handleGetOutQueue(client: Socket): void {
    this.getOutQueueUseCase.execute(client.id);
  }
}
