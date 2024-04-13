import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

export interface IGameProvider {
  handleConnection(client: Socket): void;
  handleDisconnect(client: Socket): void;
}

@WebSocketGateway(5000, { cors: true })
export class GameProvider implements IGameProvider {
  @WebSocketServer()
  private server: Server;

  private readonly logger = new Logger(GameProvider.name);

  handleConnection(client: Socket) {
    const { sockets } = this.server.sockets;

    this.logger.log(`Number of connected clients: ${sockets.size}`);
    this.logger.log(`Client id: ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client id: ${client.id} disconnected`);
  }
}
