import { WsException } from '@nestjs/websockets';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { describe, it, expect } from 'vitest';

const makeSut = () => {
  const inMemoryQueueRepository = new InMemoryQueueRepository();
  const sut = new GetOutQueueUseCase(inMemoryQueueRepository);

  return { sut, inMemoryQueueRepository };
};

describe('Get Out Queue Use Case', () => {
  it('Should throw WsException if player does not exist in the queue', () => {
    const { sut } = makeSut();

    const playerId = '1';

    expect(() => sut.execute(playerId)).toThrow(WsException);
  });

  it('Should remove player from the game queue if player exists', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';
    inMemoryQueueRepository.joinQueue(playerId);

    sut.execute(playerId);

    expect(inMemoryQueueRepository.getPlayer(playerId)).toBeNull();
  });
});
