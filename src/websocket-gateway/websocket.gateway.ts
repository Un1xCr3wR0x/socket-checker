import { OnModuleInit } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class WebsocketGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    // this.server.on('connection', (client) => this.handleConnection(client));

  }

  handleConnection(client: any) {
    console.log(client.id)
  }

  handleDisconnect(client: any) {
  }

  @SubscribeMessage('message')
  handleMessage(payload): any {
    this.server.emit('message', payload);
  }
}
