import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {

  constructor(private cookieService: CookieService, private router: Router) { }

  logout() {
    console.log("logout service triggered")
    // console.log(this.cookieService.get('token'))
    this.cookieService.delete('token');
    console.log("token after logout: ",this.cookieService.get('token'));
    this.router.navigate(['/login']);
  }
}
