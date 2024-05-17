import { Injectable } from '@nestjs/common';

import { GameConstants } from '@/main/constants/game-constants';
import { Server } from 'socket.io';

import { GameService } from './game-service';

export interface IMatchMakingService {
  handle(server: Server): void;
}

@Injectable()
export class MatchMakingService implements IMatchMakingService {
  constructor(private readonly gameService: GameService) {}

  public handle(server: Server): void {
    const isMatch = this.gameService.tryMatch();

    if (!isMatch) {
      return;
    }

    const [playerOne, playerTwo] = isMatch;

    const roomId = `match:${playerOne.id}-${playerTwo.id}`;

    server.sockets.sockets.get(playerOne.id).join(roomId);
    server.sockets.sockets.get(playerTwo.id).join(roomId);

    server.to(roomId).emit(GameConstants.client.matchStart);

    this.startMatch(server, roomId, 30);
  }

  private startMatch(server: Server, roomId: string, time: number): void {
    if (time === 0) {
      this.stopMatch(server, roomId);
      return;
    }

    server.to(roomId).emit(GameConstants.client.matchTimer, time);

    setTimeout(() => {
      this.startMatch(server, roomId, time - 1);
    }, 1000);
  }

  private stopMatch(server: Server, roomId: string): void {
    server.to(roomId).emit(GameConstants.client.matchStop);
  }
}
