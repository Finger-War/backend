import { Injectable } from '@nestjs/common';

import { Player } from '@/domain/entities/player';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { GameConstants } from '@/main/constants/game-constants';
import { Server } from 'socket.io';

import { WordsService } from './words-service';

export interface IMatchMakingService {
  handle(server: Server): void;
  startMatch(server: Server, roomId: string, time: number): void;
  stopMatch(server: Server, roomId: string): void;
}

@Injectable()
export class MatchMakingService implements IMatchMakingService {
  constructor(
    private readonly inMemoryQueueRepository: InMemoryQueueRepository,
    private readonly inMemoryMatchRepository: InMemoryMatchRepository,
    private readonly wordsService: WordsService,
  ) {}

  async handle(server: Server): Promise<void> {
    const isMatch = this.inMemoryQueueRepository.tryMatch();

    if (!isMatch) {
      return;
    }

    const [playerOne, playerTwo] = isMatch;

    if (!playerOne || !playerTwo) {
      return;
    }

    const roomId = `match:${playerOne.id}-${playerTwo.id}`;

    const randomWords = await this.wordsService
      .generateRandomWords()
      .catch(() => {
        return [];
      });

    if (!randomWords) {
      return;
    }

    const players = Object.assign(
      { [playerOne.id]: { ...playerOne, words: [] } },
      { [playerTwo.id]: { ...playerTwo, words: [] } },
    ) as Record<string, Player>;

    this.inMemoryMatchRepository.add({
      id: roomId,
      players,
      randomWords,
    });

    server.sockets.sockets.get(playerOne.id).join(roomId);
    server.sockets.sockets.get(playerTwo.id).join(roomId);

    server.to(roomId).emit(GameConstants.client.matchStart, randomWords);

    this.startMatch(server, roomId, 30);
  }

  startMatch(server: Server, roomId: string, time: number): void {
    if (time === 0) {
      this.generateMatchResult(server, roomId);
      this.stopMatch(server, roomId);
      return;
    }

    const twoPlayersInTheRoom = this.haveTwoPlayersInTheRoom(server, roomId);

    if (!twoPlayersInTheRoom) {
      return;
    }

    server.to(roomId).emit(GameConstants.client.matchTimer, time);

    setTimeout(() => {
      this.startMatch(server, roomId, time - 1);
    }, 1000);
  }

  private haveTwoPlayersInTheRoom(server: Server, roomId: string) {
    const playersInTheRoom = server.sockets.adapter.rooms.get(roomId).size;

    if (playersInTheRoom === 2) {
      return true;
    }

    this.stopMatch(server, roomId);

    return false;
  }

  private generateMatchResult(server: Server, roomId: string) {
    const match = this.inMemoryMatchRepository.findById(roomId);

    if (!match) {
      return;
    }

    const playersInOrderByWords = Object.values(match.players).sort(
      (a, b) => b.words.length - a.words.length,
    );

    const playerWithMostWords = playersInOrderByWords[0];

    const isTie =
      playersInOrderByWords.filter(
        (player) => player.words.length === playerWithMostWords.words.length,
      ).length > 1;

    if (isTie) {
      server.to(roomId).emit(GameConstants.client.matchResult, {
        ...match,
        result: {
          status: 'is-tie',
          winner: null,
          words: 0,
        },
      });
      return;
    }

    Object.values(match.players).forEach((player) => {
      const resultStatus =
        player.id === playerWithMostWords.id ? 'winner' : 'loser';

      const resultWinner =
        player.id === playerWithMostWords.id
          ? playerWithMostWords.id
          : player.id;

      const resultWords =
        player.id === playerWithMostWords.id
          ? playerWithMostWords.words.length
          : player.words.length;

      server.to(player.id).emit(GameConstants.client.matchResult, {
        ...match,
        result: {
          status: resultStatus,
          winner: resultWinner,
          words: resultWords,
        },
      });
    });
  }

  stopMatch(server: Server, roomId: string): void {
    this.inMemoryMatchRepository.remove(roomId);

    server.to(roomId).emit(GameConstants.client.matchStop);
  }
}
