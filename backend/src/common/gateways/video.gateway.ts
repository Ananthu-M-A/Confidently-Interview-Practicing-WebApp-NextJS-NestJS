import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  
  @WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
  export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(client: Socket, room: string) {
      client.join(room);
      client.to(room).emit('userJoined', client.id);
    }
  
    @SubscribeMessage('offer')
    handleOffer(client: Socket, payload: { room: string; sdp: any }) {
      client.to(payload.room).emit('offer', { sender: client.id, sdp: payload.sdp });
    }
  
    @SubscribeMessage('answer')
    handleAnswer(client: Socket, payload: { room: string; sdp: any }) {
      client.to(payload.room).emit('answer', { sender: client.id, sdp: payload.sdp });
    }
  
    @SubscribeMessage('iceCandidate')
    handleIceCandidate(client: Socket, payload: { room: string; candidate: any }) {
      client.to(payload.room).emit('iceCandidate', { sender: client.id, candidate: payload.candidate });
    }
  }
  