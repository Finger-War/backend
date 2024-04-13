import { Module } from '@nestjs/common';

import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';

import { GameController } from '@/presentation/controllers/game-controller';

import { GameService } from '@/infrastructure/services/game-service';

import { GameProvider } from '@/infrastructure/providers/game-provider';

@Module({
  imports: [],
  providers: [GameController, JoingGameQueueUseCase, GameService, GameProvider],
})
export class GameProviderModule {}
