import { Injectable, inject} from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { User } from "../models/user.model";
import { Pilacoin } from "../models/pilacoin.model";

@Injectable({
  providedIn: 'root'
})
export class PilacoinService {
  constructor(private http: HttpClient) {}

  public getPilacoins(offset: number, size: number, field: string): Observable<any>{
    return this.http.get<any>(`${environment.SERVER_API}/pilacoin/queryResponsePilas/${offset}/${size}/${field}`);
  }

  public startMining(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_API}/pilacoin/startMining`);
  }

  public stopMining(): Observable<any> {
    return this.http.get<any>(`${environment.SERVER_API}/pilacoin/stopMining`);
  }

  public getMiningData(offset: number, size: number, field: string): Observable<any>{
    return this.http.get<any>(`${environment.SERVER_API}/pilacoin_mining_data/list/${offset}/${size}/${field}`);
  }

  public refreshPilacoins(): Observable<any> {
    return this.http.post<any>(`${environment.SERVER_API}/pilacoin/query`, {});
  }

  public getUsers(): Observable<User[]>{
    return this.http.get<any>(`${environment.SERVER_API}/user/list`);
  }

  public updateUserList(): Observable<any> {
    return this.http.post<any>(`${environment.SERVER_API}/user/update`, {});
  }

  public transfer(user: User, pilacoin: Pilacoin): Observable<any> {
    const body = {
      user: user,
      pilaCoin: pilacoin
    }
    return this.http.post<any>(`${environment.SERVER_API}/pilacoin/transfer`, body);
  }

}
