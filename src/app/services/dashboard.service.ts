import { Injectable, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private http: HttpClient) { }

  public healthCheck(): Observable<any> {
    return inject(HttpClient).get<any>(`${environment.SERVER_API}/health`);
  }


}
