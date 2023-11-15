import { Injectable, inject} from '@angular/core';
import { Observable, of} from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PilacoinService {


  getPilacoins(): Observable<any>{
    return inject(HttpClient).get<any>("http://192.168.1.110:8080/pilacoin/getAll");
  }
}
