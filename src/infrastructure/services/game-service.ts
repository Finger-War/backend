import { Injectable } from '@nestjs/common';

import { Player } from '@/domain/entities/player';

export interface IGameService {
  joinQueue(playerId: string): void;
  getOutQueue(playerId: string): void;
  getPlayer(playerId: string): Player | null;
}

@Injectable()
export class GameService implements IGameService {
  private queue: Player[] = [];

  constructor() {}

  joinQueue(playerId: string): void {
    const player = { id: playerId };

    this.queue.push(player);
  }

  getOutQueue(playerId: string): void {
    this.queue = this.queue.filter((player) => player.id !== playerId);
  }

  getPlayer(playerId: string): Player | null {
    return this.queue.find((player) => player.id === playerId) ?? null;
  }
}
