import { Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { HandleWord } from '@/domain/usecases/handle-word-usecase';
import { GameConstants } from '@/main/constants/game-constants';
import { Server, Socket } from 'socket.io';

@Injectable()
export class HandleWordUseCase implements HandleWord {
  execute(server: Server, client: Socket, word: string) {
    const roomId = Array.from(client.rooms.values()).find((room) =>
      room.startsWith('match:'),
    );

    if (!roomId) {
      throw new WsException('Player not in a match');
    }

    const adversary = Array.from(server.sockets.adapter.rooms.get(roomId)).find(
      (room) => room !== client.id,
    );

    if (!adversary) {
      throw new WsException('Adversary not found in match');
    }

    client.to(adversary).emit(GameConstants.client.adversaryWords, word);
  }
}
