import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelloFingerwar(): string {
    return 'Hello, Fingerwar!';
  }
}
