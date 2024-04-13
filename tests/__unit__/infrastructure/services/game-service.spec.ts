import { Test } from '@nestjs/testing';

import { GameService } from '@/infrastructure/services/game-service';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';

const makeSut = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      GameService,
      { provide: InMemoryMatchRepository, useClass: InMemoryMatchRepository },
    ],
  }).compile();

  const sut = moduleRef.get<GameService>(GameService);

  return { sut };
};

describe('Game Service', () => {
  describe('joinQueue', () => {
    it('Should add a player to the queue', async () => {
      const { sut } = await makeSut();

      const playerId = '1';

      sut.joinQueue(playerId);

      expect(sut['queue']).toEqual([{ id: playerId }]);
    });
  });

  describe('getOutQueue', () => {
    it('Should remove a player from the queue', async () => {
      const { sut } = await makeSut();

      const playerId = '1';

      sut.joinQueue(playerId);
      sut.getOutQueue(playerId);

      expect(sut['queue']).toEqual([]);
    });
  });

  describe('getPlayer', () => {
    it('Should return null if the player is not in the queue', async () => {
      const { sut } = await makeSut();

      const player = sut.getPlayer('1');

      expect(player).toBeNull();
    });
  });
});
