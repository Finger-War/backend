import { Injectable } from '@nestjs/common';

import { Match } from '@/domain/entities/match';

export interface IMatchRepository {
  add(match: Match): void;
  findById(id: string): Match | null;
  findByPlayerId(playerId: string): Match | null;
  remove(match: Match): void;
}

@Injectable()
export class InMemoryMatchRepository implements IMatchRepository {
  private match: Match[] = [];

  add(match: Match): void {
    this.match.push(match);
  }

  findById(id: string): Match | null {
    return this.match.find((match) => match.id === id);
  }

  findByPlayerId(playerId: string): Match | null {
    return this.match.find((match) =>
      match.players.some((player) => player.id === playerId),
    );
  }

  remove(match: Match): void {
    this.match = this.match.filter((g) => g.id !== match.id);
  }
}
