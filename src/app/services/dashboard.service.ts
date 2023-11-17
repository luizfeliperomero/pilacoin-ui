import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private url: string = "http://192.168.1.110:8080";

  constructor(private http: HttpClient) { }

  public healthCheck(): Observable<any> {
    return inject(HttpClient).get<any>("http://192.168.1.110:8080/health");
  }


}
