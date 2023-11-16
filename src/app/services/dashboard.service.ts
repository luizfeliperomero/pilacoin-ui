import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  public healthCheck(): Observable<any> {
    return inject(HttpClient).get<any>("http://192.168.1.110:8080/health");
  }

  public startMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/startMining");
  }

  public stopMining(): Observable<any> {
    return this.http.get<any>("http://192.168.1.110:8080/stop");
  }
}
