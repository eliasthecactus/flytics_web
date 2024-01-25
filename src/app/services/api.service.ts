import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, userData);
  }

  availabilityCheck(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/availability?username=`+username);
  }

  ping() {
    return this.http.get(this.apiUrl+"/api/ping");
  }
}
