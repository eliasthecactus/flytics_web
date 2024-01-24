import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {

  profilePictureUrl: string = 'https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg';
  hasProfilePicture: boolean = true

  saveInformation() {
    console.log("saving information")
  }

  cancelInformation() {
    window.history.back();
  }

  deleteAccount() {
    console.log("delete account")
  }

  changeProfilePicture($event: any) {
    console.log($event)
    const file = $event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePictureUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    this.hasProfilePicture = true
  }

}
