import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import {HttpClientModule} from '@angular/common/http' 

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

    searchUser(name: string): Observable<any> {
      const headers = this.getHeaders();
      const options = { headers };
      return this.http.get(`${this.apiUrl}/api/user/search?name=`+name, options);
    }

    deleteAccount(): Observable<any> {
      const headers = this.getHeaders();
      const options = { headers };
      return this.http.delete(`${this.apiUrl}/api/user`, options);
    }
    logout(): Observable<any> {
      var token = this.cookieService.get('refresh_token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const options = { headers };
      return this.http.delete(`${this.apiUrl}/api/user/logout`, options);
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

  resetPassword(userData: any): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/user/resetpassword`, userData);
  }

  uploadFlight(file: File, flight_private?: boolean, flight_information?: string): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('file', file);

    if (flight_private !== undefined) {
      formData.append('private', String(flight_private));
    }
  
    if (flight_information !== undefined) {
      formData.append('information', flight_information);
    }

    const options = { headers };
    return this.http.post(`${this.apiUrl}/api/flights`, formData, options);
  }

  deleteFlight(flight_id: Number): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.delete(`${this.apiUrl}/api/flights/${flight_id}`, options);
  }

  getFlight(filterStringList: []): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    const validFilters = filterStringList.filter(filterString => filterString !== undefined && filterString !== null);

    var filter= ""
    if (validFilters.length > 0) {
      filter += "?" + validFilters[0];
      for (let i = 1; i < validFilters.length; i++) {
        filter += "&" + validFilters[i];
      }
    }

    console.log(filter);


    return this.http.get(`${this.apiUrl}/api/flights`+filter, options);
  }

  getFlightDetail(flight_id: []): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };
    return this.http.get(`${this.apiUrl}/api/flights`+flight_id, options);
  }

  getFlightFile(flight_id: Number, fileType?: string): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers };

    var parameter = ""

    if (fileType) {
      parameter += "?type="+fileType
    }
    return this.http.get(`${this.apiUrl}/api/flights/${flight_id}/download`+parameter, options);
  }

  downloadFlightFile(flight_id: Number, fileType?: string): Observable<any> {
    const headers = this.getHeaders();
    const options = { headers, responseType: 'blob' as 'json' };

    var parameter = ""

    if (fileType) {
      parameter += "?type="+fileType
    }
    return this.http.get(`${this.apiUrl}/api/flights/${flight_id}/download`+parameter, options);
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
