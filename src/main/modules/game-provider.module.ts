import { Module } from '@nestjs/common';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameGateway } from '@/infrastructure/gateways/game-gateway';
import { GameService } from '@/infrastructure/services/game-service';

@Module({
  imports: [],
  providers: [JoingGameQueueUseCase, GameService, GameGateway],
})
export class GameProviderModule {}
