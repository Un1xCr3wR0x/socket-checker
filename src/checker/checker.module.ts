import { Module } from '@nestjs/common';
import { CheckerService } from './checker.service';
import { CheckerController } from './checker.controller';
import { BullModule } from '@nestjs/bull';
import { CheckerProcesspr } from './checker.processor';
import { WebsocketGateway } from 'src/websocket-gateway/websocket.gateway';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'PROXIES',
    }),
  ],
  controllers: [CheckerController],
  providers: [CheckerService,CheckerProcesspr,WebsocketGateway]
})
export class CheckerModule {}
