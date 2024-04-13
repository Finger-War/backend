import { Module } from '@nestjs/common';

import { HealthModule } from '@/main/modules/health.module';
import { HelloModule } from '@/main/modules/hello.module';
import { GameProviderModule } from './main/modules/game-provider.module';

@Module({
  imports: [HealthModule, HelloModule, GameProviderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
