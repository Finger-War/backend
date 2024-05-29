import { Injectable } from '@nestjs/common';

import { Match } from '@/domain/entities/match';

export interface IMatchRepository {
  add(match: Match): void;
  findById(id: string): Match | null;
  findByPlayerId(playerId: string): Match | null;
  remove(matchId: string): void;
}

@Injectable()
export class InMemoryMatchRepository implements IMatchRepository {
  private match: Record<string, Match> = {};

  add(match: Match): void {
    this.match[match.id] = match;
  }

  findById(id: string): Match | null {
    return this.match[id] || null;
  }

  findByPlayerId(playerId: string): Match | null {
    return (
      Object.values(this.match).find((match) => {
        return Object.keys(match.players).includes(playerId);
      }) || null
    );
  }

  addCorrectWord(matchId: string, playerId: string, word: string): void {
    this.match[matchId].players[playerId].words.push(word);
  }

  remove(matchId: string): void {
    delete this.match[matchId];
  }
}
