import { Module } from '@nestjs/common';

import { GameProvider } from '@/infrastructure/providers/game-provider';

@Module({
  imports: [],
  providers: [GameProvider],
})
export class GameProviderModule {}
