import { Controller, Get } from '@nestjs/common';

import { HelloUseCase } from '@/application/usecases/hello-usecase';

@Controller()
export class HelloController {
  constructor(private readonly helloUseCase: HelloUseCase) {}

  @Get('/hello')
  execute(): string {
    return this.helloUseCase.execute();
  }
}
