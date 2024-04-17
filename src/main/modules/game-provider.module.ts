import { Module } from '@nestjs/common';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameProvider } from '@/infrastructure/providers/game-provider';
import { GameService } from '@/infrastructure/services/game-service';

@Module({
  imports: [],
  providers: [JoingGameQueueUseCase, GameService, GameProvider],
})
export class GameProviderModule {}
