import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppGate } from './app.gate';
import { AppService } from './services/app.service';


@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGate],
})
export class AppModule {}
