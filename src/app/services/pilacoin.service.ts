import { Injectable, inject} from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PilacoinService {
  private url: string = "http://192.168.1.110:8080";

  constructor(private http: HttpClient) {}

  public getPilacoins(offset: number, size: number, field: string): Observable<any>{
    return this.http.get<any>(`http://192.168.1.110:8080/pilacoin/paginationAndSort/${offset}/${size}/${field}`);
  }

  public startMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/pilacoin/startMining");
  }

  public stopMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/pilacoin/stopMining");
  }

  public getMiningData(offset: number, size: number, field: string): Observable<any>{
    return this.http.get<any>(`http://192.168.1.110:8080/pilacoin_mining_data/list/${offset}/${size}/${field}`);
  }

}
