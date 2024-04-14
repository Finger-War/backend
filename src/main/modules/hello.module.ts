import { Module } from '@nestjs/common';

import { HelloUseCase } from '@/application/usecases/hello-usecase';
import { HelloController } from '@/presentation/controllers/hello-controller';

@Module({
  imports: [],
  controllers: [HelloController],
  providers: [HelloUseCase],
})
export class HelloModule {}
