import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class StompService {

  socket = new SockJS('http://192.168.1.110:8080/mining');
  stompClient = Stomp.over(this.socket);

  constructor() { }

  subscribe(topic: string, callback: any): void {
    const connected: boolean = this.stompClient.connected;
    if(connected) {
      this.subscribeToTopic(topic, callback);
      return;
    }
    this.stompClient.connect({}, (): any => {
      this.subscribeToTopic(topic, callback);
    })
  }

  private subscribeToTopic(topic: string, callback: any): void {
    this.stompClient.subscribe(topic, (data): any => {
        data = JSON.parse(data.body);
        callback(data);
    })
  }
}
