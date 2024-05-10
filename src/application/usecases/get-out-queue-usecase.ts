import { Injectable } from '@nestjs/common';

import { GetOutQueue } from '@/domain/usecases/get-out-queue-usecase';
import { GameService } from '@/infrastructure/services/game-service';

@Injectable()
export class GetOutQueueUseCase implements GetOutQueue {
  constructor(private readonly gameService: GameService) {}

  execute(playerId: string) {
    const playerExistsInQueue = this.gameService.getPlayer(playerId);

    if (!playerExistsInQueue) {
      return;
    }

    this.gameService.getOutQueue(playerId);
  }
}
