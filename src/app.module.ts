import { Module } from '@nestjs/common';
import { AppService } from './application/hello.service';
import { AppController } from './app.controler';
import { HelloController } from './application/hello.controller';

@Module({
  imports: [],
  controllers: [AppController, HelloController],
  providers: [AppService],
})
export class AppModule {}
