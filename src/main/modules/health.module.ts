import { Module } from '@nestjs/common';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  async health() {
    return 'health';
  }
}

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [],
})
export class HealthModule {}
