import { Module } from '@nestjs/common';

import { HealthModule } from '@/main/modules/health.module';
import { HelloModule } from '@/main/modules/hello.module';

@Module({
  imports: [HealthModule, HelloModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
