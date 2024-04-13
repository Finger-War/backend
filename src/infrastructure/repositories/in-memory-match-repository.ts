import { Injectable } from '@nestjs/common';

import { Match } from '@/domain/entities/match';

@Injectable()
export class InMemoryMatchRepository {
  private match: Match[] = [];

  add(match: Match): void {
    this.match.push(match);
  }
}
