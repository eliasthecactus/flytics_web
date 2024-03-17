import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';


@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private cookieService: CookieService) { }

  changeTheme(theme: string) {
    this.cookieService.set('theme', theme)
    document.documentElement.setAttribute("data-theme",theme)
  }

  setSavedTheme() {
    document.documentElement.setAttribute("data-theme",this.cookieService.get('theme'))
  }
}
