import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private http: HttpClient) {}

  public startMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/block/startMining");
  }
  public stopMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/block/stopMining");
  }
}
