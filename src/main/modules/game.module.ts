import { Module } from '@nestjs/common';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameGateway } from '@/infrastructure/gateways/game-gateway';
import { GameService } from '@/infrastructure/services/game-service';

@Module({
  imports: [],
  providers: [
    JoingGameQueueUseCase,
    GetOutQueueUseCase,
    GameService,
    GameGateway,
  ],
})
export class GameModule {}