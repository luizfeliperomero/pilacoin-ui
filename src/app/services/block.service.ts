import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlockService {

  constructor(private http: HttpClient) {}

  public startMining(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_API}/block/startMining`);
  }
  public stopMining(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_API}/block/stopMining`);
  }
}
