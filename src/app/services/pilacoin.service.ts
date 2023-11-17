import { Injectable, inject} from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PilacoinService {
  private url: string = "http://192.168.1.110:8080";

  constructor(private http: HttpClient) {}

  getPilacoins(): Observable<any>{
    return inject(HttpClient).get<any>("http://192.168.1.110:8080/pilacoin/getAll");
  }

  public startMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/pilacoin/startMining");
  }

  public stopMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/pilacoin/stopMining");
  }

}
