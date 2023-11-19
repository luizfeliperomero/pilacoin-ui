import { Injectable } from '@angular/core';
import { Observable, of} from 'rxjs';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class StompService {
  private url: string = "http://192.168.1.110:8080";

  socket = new SockJS('http://192.168.1.110:8080/mining');
  stompClient = Stomp.over(this.socket);

  constructor() { }

  subscribe(topic: string, callback: any, id: any): any {
    console.log(`${topic}: 1`);
    const connected: boolean = this.stompClient.connected;
    if(connected) {
    console.log(`${topic}: 2`);
      return this.subscribeToTopic(topic, callback, id);
    }
    this.stompClient.connect({}, (): any => {
    console.log(`${topic}: 3`);
      return this.subscribeToTopic(topic, callback, id);
    })
  }

  private subscribeToTopic(topic: string, callback: any, id: any): Object {
    console.log(`${topic}: 4`);
    return this.stompClient.subscribe(topic, (data): any => {
        data = JSON.parse(data.body);
        callback(data);
    }, id)
  }
}
