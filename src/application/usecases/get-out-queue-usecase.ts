import { Injectable } from '@nestjs/common';

import { GetOutQueue } from '@/domain/usecases/get-out-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';

@Injectable()
export class GetOutQueueUseCase implements GetOutQueue {
  constructor(
    private readonly inMemoryQueueRepository: InMemoryQueueRepository,
  ) {}

  execute(playerId: string) {
    const playerExistsInQueue =
      this.inMemoryQueueRepository.getPlayer(playerId);

    if (!playerExistsInQueue) {
      return;
    }

    this.inMemoryQueueRepository.getOutQueue(playerId);
  }
}
