import { Module } from '@nestjs/common';

import { EnvsModule } from '@/main/config/envs/envs.module';
import { GameProviderModule } from '@/main/modules/game-provider.module';
import { HealthModule } from '@/main/modules/health.module';
import { HelloModule } from '@/main/modules/hello.module';

@Module({
  imports: [EnvsModule, HealthModule, HelloModule, GameProviderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
