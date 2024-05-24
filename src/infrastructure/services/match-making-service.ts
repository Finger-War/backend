import { Injectable } from '@nestjs/common';

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
    private readonly wordsService: WordsService,
  ) {}

  public async handle(server: Server): Promise<void> {
    const isMatch = this.inMemoryQueueRepository.tryMatch();

    if (!isMatch) {
      return;
    }

    const [playerOne, playerTwo] = isMatch;

    const roomId = `match:${playerOne.id}-${playerTwo.id}`;

    const randomWords = await this.wordsService.generateRandomWord();

    if (!randomWords) {
      return;
    }

    server.sockets.sockets.get(playerOne.id).join(roomId);
    server.sockets.sockets.get(playerTwo.id).join(roomId);

    server.to(roomId).emit(GameConstants.client.matchStart, randomWords);

    this.startMatch(server, roomId, 30);
  }

  startMatch(server: Server, roomId: string, time: number): void {
    if (time === 0) {
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

  stopMatch(server: Server, roomId: string): void {
    server.to(roomId).emit(GameConstants.client.matchStop);
  }
}
