import { Module } from '@nestjs/common';

import { HelloController } from '@/presentation/controllers/hello-controller';
import { HelloUseCase } from '@/application/usecases/hello-usecase';

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [HelloUseCase],
})
export class HelloModule {}
