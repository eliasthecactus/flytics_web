import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  private getHeaders(): HttpHeaders {
    var token = this.cookieService.get('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  signup(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/register`, userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/user/login`, userData);
  }

  changePassword(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/user/changepassword`, userData, options);
  }

  changeUserinformation(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.put(`${this.apiUrl}/api/user`, userData, options);
  }
  getUserInformation(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/user`, options);  }

  availabilityCheck(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/user/availability?username=`+username);
  }

  deleteAccount(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/user`, options);
  }

  changeProfilePicture(file: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);

    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/user/image`, formData, options);
  }

  deleteProfilePicture(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/user/image`, options);
  }

  ping() {
    return this.http.get(this.apiUrl+"/api/ping");
  }

  authPing(): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/authping`, options);
  }
}
