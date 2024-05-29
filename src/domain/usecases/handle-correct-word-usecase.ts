import { Socket } from 'socket.io';

export interface HandleCorrectWord {
  execute: (client: Socket, word: string) => void;
}
