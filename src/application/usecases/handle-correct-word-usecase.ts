import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { HandleCorrectWord } from '@/domain/usecases/handle-correct-word-usecase';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { Socket } from 'socket.io';

@Injectable()
export class HandleCorrectWordUseCase implements HandleCorrectWord {
  constructor(
    private readonly inMemoryMatchRepository: InMemoryMatchRepository,
  ) {}

  execute(client: Socket, word: string) {
    const match = this.inMemoryMatchRepository.findByPlayerId(client.id);

    if (!match) {
      throw new WsException('Player not in a match');
    }

    this.inMemoryMatchRepository.addCorrectWord(match.id, client.id, word);
  }
}
