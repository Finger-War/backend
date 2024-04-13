import { Test } from '@nestjs/testing';

import { GameService } from '@/infrastructure/services/game-service';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';

describe('Game Service', () => {
  let gameService: GameService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GameService,
        { provide: InMemoryMatchRepository, useClass: InMemoryMatchRepository },
      ],
    }).compile();

    gameService = moduleRef.get<GameService>(GameService);
  });

  describe('joinQueue', () => {
    it('Should add a player to the queue', () => {
      const playerId = 'player1';

      gameService.joinQueue(playerId);

      expect(gameService['queue']).toEqual([{ id: playerId }]);
    });
  });
});
