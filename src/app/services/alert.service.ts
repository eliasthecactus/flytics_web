import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  alertMessage: string = '';
  showAlert: boolean = false;
  alertLevel: string = 'error';

  show(level: string, message: string) {
    this.alertMessage = message;
    this.alertLevel = level;
    this.showAlert = true;

    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
  constructor() { }
}
