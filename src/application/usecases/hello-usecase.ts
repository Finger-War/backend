import { Injectable } from '@nestjs/common';

import { Hello } from '@/domain/usecases/hello-usecase';

@Injectable()
export class HelloUseCase implements Hello {
  execute(): string {
    return 'Hello, Fingerwar!';
  }
}
