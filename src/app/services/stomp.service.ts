import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { webSocket } from 'rxjs/webSocket';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StompService {
  socket = new SockJS(`${environment.SERVER_API}/mining`);
  stompClient = Stomp.over(this.socket);

  constructor() { }

  openNewConnection(callback) {
    this.socket = new SockJS(`${environment.SERVER_API}/mining`);
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect({}, () => {
      callback();
    })
  }

  subscribe(topic: string, callback: any, id: any): any {
    const connected: boolean = this.stompClient.connected;
    if(connected) {
      return this.subscribeToTopic(topic, callback, id);
    }
    this.stompClient.connect({}, (): any => {
      return this.subscribeToTopic(topic, callback, id);
    })
  }

  private subscribeToTopic(topic: string, callback: any, id: any): Object {
    return this.stompClient.subscribe(topic, (data): any => {
        data = JSON.parse(data.body);
        callback(data);
    }, id)
  }
}
