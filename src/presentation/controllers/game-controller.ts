import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { Socket } from 'socket.io';

export interface IGameController {
  handleStart(client: Socket): void;
}

@WebSocketGateway(5000, { cors: true })
export class GameController implements IGameController {
  constructor(private readonly joinGameQueueUseCase: JoingGameQueueUseCase) {}

  @SubscribeMessage('join-queue')
  handleStart(client: Socket): void {
    this.joinGameQueueUseCase.execute(client.id);
  }
}
