import { IoAdapter } from '@nestjs/platform-socket.io';

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port?: number, options?: any) {
    const server = super.createIOServer(port, options);

    server.setMaxListeners(20);

    return server;
  }
}
