import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { JoinGameQueue } from '@/domain/usecases/join-game-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';

@Injectable()
export class JoingGameQueueUseCase implements JoinGameQueue {
  constructor(
    private readonly inMemoryQueueRepository: InMemoryQueueRepository,
  ) {}

  execute(playerId: string) {
    const playerAlreadyExistsInQueue =
      this.inMemoryQueueRepository.getPlayer(playerId);

    if (playerAlreadyExistsInQueue) {
      throw new WsException('Player already in queue');
    }

    this.inMemoryQueueRepository.joinQueue(playerId);
  }
}
