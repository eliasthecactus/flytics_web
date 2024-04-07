import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private cookieService: CookieService, private router: Router) { }

  logout() {
    // console.log("logout service triggered")
    this.cookieService.delete('token', '/');
    this.cookieService.delete('refresh_token', '/');
    localStorage.removeItem('accesshTokenExpire');
    localStorage.removeItem('refreshTokenExpire');
    localStorage.removeItem('user_id');

    this.router.navigate(['/login']);

    // console.log(this.cookieService.get('token'))


    // this.apiService.logout().subscribe(
    //   (response) => {
    //     console.log(response);
    //     if (response.code == 0) {
    //       console.log("logout successfull")
    //       this.cookieService.delete('token', '/');
    //       this.cookieService.delete('refresh_token', '/');
    //       this.router.navigate(['/login']);
    //     }
    //   },
    //   (error) => {
    //     console.log("logout failed")
    //   }
    // );

  }
}
