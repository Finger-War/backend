import { Injectable } from '@nestjs/common';

import { Player } from '@/domain/entities/player';

export interface IGameService {
  joinQueue(playerId: string): void;
}

@Injectable()
export class GameService implements IGameService {
  private queue: Player[] = [];

  constructor() {}

  joinQueue(playerId: string): void {
    const player = { id: playerId };

    this.queue.push(player);
  }
}
