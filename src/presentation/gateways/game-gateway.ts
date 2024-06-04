import { Logger, UseFilters } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { HandleCorrectWordUseCase } from '@/application/usecases/handle-correct-word-usecase';
import { HandleWordUseCase } from '@/application/usecases/handle-word-usecase';
import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { MatchMakingService } from '@/infrastructure/services/match-making-service';
import { envs } from '@/main/config/envs';
import { GameConstants } from '@/main/constants/game-constants';
import { WsExceptionFilter } from '@/presentation/filters/ws-exception-filter';
import { Server, Socket } from 'socket.io';

export interface IGameGateway {
  handleConnection(client: Socket): void;
  handleDisconnect(client: Socket): void;
}

@WebSocketGateway({ cors: true, port: envs.CONTAINER_PORT })
@UseFilters(new WsExceptionFilter())
export class GameGateway implements IGameGateway {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly joinGameQueueUseCase: JoingGameQueueUseCase,
    private readonly getOutQueueUseCase: GetOutQueueUseCase,
    private readonly handleWordUseCase: HandleWordUseCase,
    private readonly handleCorrectUseCase: HandleCorrectWordUseCase,
    private readonly matchMakingService: MatchMakingService,
  ) {}

  handleConnection(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} connected`);

    this.server.emit(GameConstants.client.informations, {
      connectedPlayers: sockets.size,
    });
  }

  handleDisconnect(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Client id: ${client.id} disconnected`);

    this.server.emit(GameConstants.client.informations, {
      connectedPlayers: sockets.size,
    });
  }

  @SubscribeMessage(GameConstants.server.joinQueue)
  handleJoinQueue(client: Socket): void {
    this.joinGameQueueUseCase.execute(client.id);

    this.matchMakingService.handle(this.server);
  }

  @SubscribeMessage(GameConstants.server.getOutQueue)
  handleGetOutQueue(client: Socket): void {
    this.getOutQueueUseCase.execute(client.id);
  }

  @SubscribeMessage(GameConstants.server.handleWord)
  handleWord(client: Socket, word: string): void {
    this.handleWordUseCase.execute(this.server, client, word);
  }

  @SubscribeMessage(GameConstants.server.handleCorrectWord)
  handleCorrectWord(client: Socket, word: string) {
    this.handleCorrectUseCase.execute(client, word);
  }

  @SubscribeMessage(GameConstants.server.clientError)
  handleClientError(client: Socket) {
    const matchId = Array.from(client.rooms.values()).find((room) =>
      room.startsWith('match:'),
    );

    if (!matchId) {
      return;
    }

    this.logger.log(`Client id: ${client.id} stopped`);

    this.matchMakingService.stopMatch(this.server, matchId);
  }
}
