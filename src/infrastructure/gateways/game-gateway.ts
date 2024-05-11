import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';
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
    private readonly gameService: GameService,
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
    this.handleMatchQueue();
  }

  @SubscribeMessage(GameConstants.server.getOutQueue)
  handleGetOutQueue(client: Socket): void {
    this.getOutQueueUseCase.execute(client.id);
  }

  @SubscribeMessage(GameConstants.server.handleWord)
  handleWord(client: Socket, word: string): void {
    const roomId = Array.from(client.rooms.values()).find((room) =>
      room.startsWith('match:'),
    );

    if (!roomId) {
      return;
    }

    const adversary = Array.from(
      this.server.sockets.adapter.rooms.get(roomId),
    ).find((room) => room !== client.id);

    if (adversary) {
      client.to(adversary).emit(GameConstants.server.adversaryWords, word);
    }
  }

  handleMatchQueue() {
    const isMatch = this.gameService.tryMatch();

    if (!isMatch) {
      return;
    }

    const [playerOne, playerTwo] = isMatch;

    const roomId = `match:${playerOne.id}-${playerTwo.id}`;

    this.server.sockets.sockets.get(playerOne.id).join(roomId);
    this.server.sockets.sockets.get(playerTwo.id).join(roomId);

    this.server.to(roomId).emit(GameConstants.server.matchStart);
  }
}
