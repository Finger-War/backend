import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { GetOutQueueUseCase } from '@/application/usecases/get-out-queue-usecase';
import { HandleCorrectWordUseCase } from '@/application/usecases/handle-correct-word-usecase';
import { HandleWordUseCase } from '@/application/usecases/handle-word-usecase';
import { JoingGameQueueUseCase } from '@/application/usecases/joing-game-queue-usecase';
import { InMemoryMatchRepository } from '@/infrastructure/repositories/in-memory-match-repository';
import { InMemoryQueueRepository } from '@/infrastructure/repositories/in-memory-queue-repository';
import { MatchMakingService } from '@/infrastructure/services/match-making-service';
import { WordsService } from '@/infrastructure/services/words-service';
import { GameGateway } from '@/presentation/gateways/game-gateway';

@Module({
  imports: [HttpModule],
  providers: [
    InMemoryQueueRepository,
    InMemoryMatchRepository,
    JoingGameQueueUseCase,
    GetOutQueueUseCase,
    HandleWordUseCase,
    HandleCorrectWordUseCase,
    MatchMakingService,
    WordsService,
    GameGateway,
  ],
})
export class GameModule {}
