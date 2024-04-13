import { Injectable } from '@nestjs/common';

import { Match } from '@/domain/entities/match';

@Injectable()
export class InMemoryMatchRepository {
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
}
