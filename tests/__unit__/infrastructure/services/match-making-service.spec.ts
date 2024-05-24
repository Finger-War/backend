import { Test } from '@nestjs/testing';

import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { MatchMakingService } from '@/infrastructure/services/match-making-service';
import { WordsService } from '@/infrastructure/services/words-service';
import { GameConstants } from '@/main/constants/game-constants';
import { Server } from 'socket.io';
import { vi, describe, it, expect } from 'vitest';

const makeSut = async () => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      InMemoryQueueRepository,
      WordsService,
      { provide: InMemoryMatchRepository, useClass: InMemoryMatchRepository },
      MatchMakingService,
    ],
  }).compile();

  const inMemoryQueueRepository = moduleRef.get<InMemoryQueueRepository>(
    InMemoryQueueRepository,
  );
  const wordsService = moduleRef.get<WordsService>(WordsService);
  const sut = moduleRef.get<MatchMakingService>(MatchMakingService);

  return { sut, inMemoryQueueRepository, wordsService };
};

const makeServerMock = (): Server =>
  ({
    sockets: {
      sockets: {
        get: vi.fn().mockReturnValue({ join: vi.fn() }),
      },
      adapter: {
        rooms: new Map<string, Set<string>>(),
      },
    },
    to: vi.fn().mockReturnThis(),
    emit: vi.fn(),
  }) as any;

describe('MatchMakingService', () => {
  describe('handle', () => {
    it('Should start a match if there is a match available', async () => {
      const { sut, inMemoryQueueRepository, wordsService } = await makeSut();

      const playerOne = { id: 'player-one' };
      const playerTwo = { id: 'player-two' };
      const roomId = `match:${playerOne.id}-${playerTwo.id}`;
      const randomWords = ['words-one', 'word-two'];

      vi.spyOn(inMemoryQueueRepository, 'tryMatch').mockReturnValue([
        playerOne,
        playerTwo,
      ]);
      vi.spyOn(wordsService, 'generateRandomWord').mockResolvedValue(
        randomWords,
      );

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(
        roomId,
        new Set([playerOne.id, playerTwo.id]),
      );

      await sut.handle(server);

      expect(server.sockets.sockets.get).toHaveBeenCalledWith(playerOne.id);
      expect(server.sockets.sockets.get).toHaveBeenCalledWith(playerTwo.id);
      expect(server.to).toHaveBeenCalledWith(roomId);
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchStart,
        randomWords,
      );
    });

    it('Should not start a match if there is no match available', async () => {
      const { sut, inMemoryQueueRepository } = await makeSut();

      vi.spyOn(inMemoryQueueRepository, 'tryMatch').mockReturnValue(undefined);

      const server = makeServerMock();

      await sut.handle(server);

      expect(server.sockets.sockets.get).not.toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled();
    });

    it('Should not start a match if wordsService returns undefined', async () => {
      const { sut, inMemoryQueueRepository, wordsService } = await makeSut();

      const playerOne = { id: 'player-one' };
      const playerTwo = { id: 'player-two' };

      vi.spyOn(inMemoryQueueRepository, 'tryMatch').mockReturnValue([
        playerOne,
        playerTwo,
      ]);
      vi.spyOn(wordsService, 'generateRandomWord').mockResolvedValue(undefined);

      const server = makeServerMock();

      await sut.handle(server);

      expect(server.sockets.sockets.get).not.toHaveBeenCalled();
      expect(server.to).not.toHaveBeenCalled();
    });
  });

  describe('startMatch', () => {
    it('Should stop match when time reaches zero', async () => {
      const { sut } = await makeSut();

      vi.useFakeTimers();

      const playerOne = { id: 'player-one' };
      const playerTwo = { id: 'player-two' };
      const roomId = `match:${playerOne.id}-${playerTwo.id}`;

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(
        roomId,
        new Set([playerOne.id, playerTwo.id]),
      );

      const stopMatchSpy = vi.spyOn(sut, 'stopMatch');

      sut.startMatch(server, roomId, 1);

      vi.runAllTimers();

      expect(stopMatchSpy).toHaveBeenCalledWith(server, roomId);
      expect(server.to).toHaveBeenCalledWith(roomId);
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchTimer,
        1,
      );

      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchStop,
      );
    });

    it('Should continue the match timer until it reaches zero', async () => {
      const { sut } = await makeSut();

      vi.useFakeTimers();

      const playerOne = { id: 'player-one' };
      const playerTwo = { id: 'player-two' };
      const roomId = `match:${playerOne.id}-${playerTwo.id}`;

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(
        roomId,
        new Set([playerOne.id, playerTwo.id]),
      );

      sut.startMatch(server, roomId, 2);

      vi.advanceTimersByTime(1000);
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchTimer,
        2,
      );
      vi.advanceTimersByTime(1000);
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchTimer,
        1,
      );
      vi.advanceTimersByTime(1000);

      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchStop,
      );
    });

    it('Should stop match if there are less than two players in the room', async () => {
      const { sut } = await makeSut();

      vi.useFakeTimers();

      const playerOne = { id: 'player-one' };
      const roomId = `match:${playerOne.id}-player-two`;

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(roomId, new Set([playerOne.id]));

      const stopMatchSpy = vi.spyOn(sut, 'stopMatch');

      sut.startMatch(server, roomId, 2);

      vi.advanceTimersByTime(1000);

      expect(stopMatchSpy).toHaveBeenCalledWith(server, roomId);
      expect(server.to(roomId).emit).not.toHaveBeenCalledWith(
        GameConstants.client.matchTimer,
        1,
      );
      expect(server.to(roomId).emit).toHaveBeenCalledWith(
        GameConstants.client.matchStop,
      );
    });
  });

  describe('haveTwoPlayersInTheRoom', () => {
    it('Should return true if there are two players in the room', async () => {
      const { sut } = await makeSut();

      const playerOne = { id: 'player-one' };
      const playerTwo = { id: 'player-two' };
      const roomId = `match:${playerOne.id}-${playerTwo.id}`;

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(
        roomId,
        new Set([playerOne.id, playerTwo.id]),
      );

      const result = sut['haveTwoPlayersInTheRoom'](server, roomId);

      expect(result).toBe(true);
    });

    it('Should return false and call stopMatch if there are less than two players in the room', async () => {
      const { sut } = await makeSut();

      const playerOne = { id: 'player-one' };
      const roomId = `match:${playerOne.id}-player-two`;

      const server = makeServerMock();
      server.sockets.adapter.rooms.set(roomId, new Set([playerOne.id]));

      const stopMatchSpy = vi.spyOn(sut, 'stopMatch');

      const result = sut['haveTwoPlayersInTheRoom'](server, roomId);

      expect(result).toBe(false);
      expect(stopMatchSpy).toHaveBeenCalledWith(server, roomId);
    });
  });
});
