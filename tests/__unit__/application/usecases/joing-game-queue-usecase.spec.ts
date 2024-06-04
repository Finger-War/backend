import { WsException } from '@nestjs/websockets';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { describe, it, expect } from 'vitest';

const makeSut = () => {
  const inMemoryQueueRepository = new InMemoryQueueRepository();
  const sut = new JoingGameQueueUseCase(inMemoryQueueRepository);

  return { sut, inMemoryQueueRepository };
};

describe('Join Game Queue Use Case', () => {
  it('Should throw WsException if player is already in the queue', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';
    inMemoryQueueRepository.joinQueue(playerId);

    expect(() => sut.execute(playerId)).toThrow(WsException);
  });

  it('Should add player to the game queue if player does not already exist', () => {
    const { sut, inMemoryQueueRepository } = makeSut();

    const playerId = '1';

    sut.execute(playerId);

    expect(inMemoryQueueRepository.getPlayer(playerId)).toBeDefined();
  });
});
