import { Module } from '@nestjs/common';
import { AppController } from './application/app.controller';
import { AppService } from './application/app.service';
import { HealthController } from './application/health.controller';

@Module({
  imports: [],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
