import { Module } from '@nestjs/common';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { GameProvider } from '@/infrastructure/providers/game-provider';
import { GameService } from '@/infrastructure/services/game-service';
import { GameController } from '@/presentation/controllers/game-controller';

@Module({
  imports: [],
  providers: [GameController, JoingGameQueueUseCase, GameService, GameProvider],
})
export class GameProviderModule {}
