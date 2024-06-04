import { Injectable } from '@nestjs/common';

import { Queue } from '@/domain/entities/queue';

export interface IInMemoryQueueRepository {
  joinQueue(playerId: string): void;
  getOutQueue(playerId: string): void;
  getPlayer(playerId: string): Queue | null;
  tryMatch(): Queue[] | undefined;
}

@Injectable()
export class InMemoryQueueRepository implements IInMemoryQueueRepository {
  private queue: Queue[] = [];

  joinQueue(playerId: string): void {
    const player = { id: playerId };

    this.queue.push(player);
  }

  getOutQueue(playerId: string): void {
    this.queue = this.queue.filter((player) => player.id !== playerId);
  }

  getPlayer(playerId: string): Queue | null {
    return this.queue.find((player) => player.id === playerId) ?? null;
  }

  tryMatch() {
    if (this.queue.length < 2) {
      return;
    }

    const playerOne = this.queue.shift();
    const playerTwo = this.queue.shift();

    return [playerOne, playerTwo];
  }
}
