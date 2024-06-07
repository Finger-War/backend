import { Injectable } from '@nestjs/common';

import { Player } from '@/domain/entities/player';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { GameConstants } from '@/main/constants/game-constants';
import { Server } from 'socket.io';

import { WordsService } from './words-service';

export interface IMatchMakingService {
  handle(server: Server): void;
  startMatch(
    server: Server,
    roomId: string,
    time: number,
    players: Record<string, Player>,
    randomWords: string[],
  ): void;
  stopMatch(server: Server, roomId: string): void;
}

@Injectable()
export class MatchMakingService implements IMatchMakingService {
  constructor(
    private readonly inMemoryQueueRepository: InMemoryQueueRepository,
    private readonly inMemoryMatchRepository: InMemoryMatchRepository,
    private readonly wordsService: WordsService,
  ) {}

  async handle(server: Server) {
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

    const playerOneSocket = server.sockets.sockets.get(playerOne.id);
    const playerTwoSocket = server.sockets.sockets.get(playerTwo.id);

    if (!playerOneSocket || !playerTwoSocket) {
      return;
    }

    playerOneSocket.join(roomId);
    playerTwoSocket.join(roomId);

    this.startMatch(server, roomId, 60, players, randomWords);
  }

  startMatch(
    server: Server,
    roomId: string,
    time: number,
    players: Record<string, Player>,
    randomWords: string[],
  ): void {
    this.inMemoryMatchRepository.add({
      id: roomId,
      players,
      randomWords,
    });

    server.to(roomId).emit(GameConstants.client.matchStart, randomWords);

    this.match(server, roomId, time);
  }

  private match(server: Server, roomId: string, time: number) {
    if (time === 0) {
      return this.generateMatchResult(server, roomId);
    }

    const normalMatchRequirements = this.haveNormalMatchRequirements(
      server,
      roomId,
    );

    if (!normalMatchRequirements) {
      return this.stopMatch(server, roomId);
    }

    server.to(roomId).emit(GameConstants.client.matchTimer, time);

    setTimeout(() => {
      return this.match(server, roomId, time - 1);
    }, 1000);
  }

  private haveNormalMatchRequirements(server: Server, roomId: string): boolean {
    const haveMatch = this.inMemoryMatchRepository.findById(roomId);

    if (!haveMatch) {
      return false;
    }

    const haveRoom = server.sockets.adapter.rooms.get(roomId);

    if (!haveRoom) {
      return false;
    }

    const havePlayers = haveRoom.size === 2;

    if (!havePlayers) {
      return false;
    }

    return true;
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

      return this.stopMatch(server, roomId);
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

    return this.stopMatch(server, roomId);
  }

  stopMatch(server: Server, roomId: string): void {
    this.inMemoryMatchRepository.remove(roomId);

    server.to(roomId).emit(GameConstants.client.matchStop);

    server.socketsLeave(roomId);
  }
}
