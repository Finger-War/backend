import { Module } from '@nestjs/common';

import { EnvsModule } from '@/main/config/envs/envs.module';
import { GameModule } from '@/main/modules/game.module';
import { HealthModule } from '@/main/modules/health.module';
import { HelloModule } from '@/main/modules/hello.module';

@Module({
  imports: [EnvsModule, HealthModule, HelloModule, GameModule],
})
export class AppModule {}
