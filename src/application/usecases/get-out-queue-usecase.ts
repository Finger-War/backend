import { Injectable } from '@nestjs/common';

import { GetOutQueue } from '@/domain/usecases/get-out-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

@Injectable()
export class GetOutQueueUseCase implements GetOutQueue {
  constructor(private readonly gameService: GameService) {}

  execute(playerId: string) {
    const playerAlreadyExistsInQueue = this.gameService.getPlayer(playerId);

    if (!playerAlreadyExistsInQueue) {
      return;
    }

    this.gameService.getOutQueue(playerId);
  }
}
