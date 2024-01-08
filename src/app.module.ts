import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CheckerModule } from './checker/checker.module';
import { BullModule } from '@nestjs/bull';
import { WebsocketGateway } from './websocket-gateway/websocket.gateway';

@Module({
  imports: [
    CheckerModule, 
    BullModule.forRoot({
    redis: {
      host: '146.235.208.110',
      port: 6377,
      password: "RedisAuth"
    },
  })],
  controllers: [AppController],
})
export class AppModule { }
