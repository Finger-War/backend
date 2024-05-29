import { Server, Socket } from 'socket.io';

export interface HandleWord {
  execute: (server: Server, client: Socket, word: string) => void;
}
