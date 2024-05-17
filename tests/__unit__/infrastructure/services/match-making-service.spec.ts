import { Test } from '@nestjs/testing';

import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { GameService } from '@/infrastructure/services/game-service';
import { MatchMakingService } from '@/infrastructure/services/match-making-service';
import { GameConstants } from '@/main/constants/game-constants';
import { Server } from 'socket.io';

const makeSut = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      GameService,
      { provide: InMemoryMatchRepository, useClass: InMemoryMatchRepository },
      MatchMakingService,
    ],
  }).compile();

  const gameService = moduleRef.get<GameService>(GameService);

  const sut = moduleRef.get<MatchMakingService>(MatchMakingService);

  return { sut, gameService };
};

describe('Match Making Service', () => {
  describe('handle', () => {
    it('Should start a match if there is a match available', async () => {
      const { sut, gameService } = await makeSut();

      const playerOne = { id: 'player1' };
      const playerTwo = { id: 'player2' };
      const roomId = `match:${playerOne.id}-${playerTwo.id}`;

      vitest
        .spyOn(gameService, 'tryMatch')
        .mockReturnValue([playerOne, playerTwo]);

      const server: Server = {
        sockets: {
          sockets: {
            get: vitest.fn().mockReturnValue({ join: vitest.fn() }),
          },
        },
        to: vitest.fn().mockReturnValue({ emit: vitest.fn() }),
      } as any;

      sut.handle(server);

      expect(server.sockets.sockets.get).toHaveBeenCalledWith(playerOne.id);
      expect(server.sockets.sockets.get).toHaveBeenCalledWith(playerTwo.id);
      expect(server.to).toHaveBeenCalledWith(roomId);
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchStart,
      );
    });

    it('Should not start a match if there is no match available', async () => {
      const { sut, gameService } = await makeSut();

      vitest.spyOn(gameService, 'tryMatch').mockReturnValue(undefined);

      const server: Server = {
        sockets: {
          sockets: {
            get: vitest.fn().mockReturnValue({ join: vitest.fn() }),
          },
        },
        to: vitest.fn().mockReturnValue({ emit: vitest.fn() }),
      } as any;

      sut.handle(server);

      expect(server.sockets.sockets.get).not.toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled();
    });
  });
});
