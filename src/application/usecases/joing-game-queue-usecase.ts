import { Injectable } from '@nestjs/common';

import { JoinGameQueue } from '@/domain/usecases/join-game-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

@Injectable()
export class JoingGameQueueUseCase implements JoinGameQueue {
  constructor(private readonly gameService: GameService) {}

  execute(playerId: string) {
    const playerAlreadyExistsInQueue = this.gameService.getPlayer(playerId);

    if (playerAlreadyExistsInQueue) {
      return;
    }

    this.gameService.joinQueue(playerId);
  }
}
