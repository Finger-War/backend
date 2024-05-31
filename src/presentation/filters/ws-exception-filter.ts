import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

import { GameConstants } from '@/main/constants/game-constants';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();

    const errorMessage = exception.getError();

    this.logger.error(`Client id: ${client.id} - ${errorMessage}`);

    client.emit(GameConstants.client.matchError, { errorMessage });
  }
}
