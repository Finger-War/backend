import { Controller, Get } from '@nestjs/common';
import { AppService } from './hello.service';

@Controller()
export class HelloController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHelloFingerwar();
  }
}
