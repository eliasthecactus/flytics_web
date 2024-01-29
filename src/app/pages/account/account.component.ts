import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AlertService } from '../../services/alert.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TokenCheckerService } from '../../services/token-checker.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './account.component.html',
  providers: [ApiService, TokenCheckerService],
  styleUrl: './account.component.css'
})
export class AccountComponent {
  emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  userData: any = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    profilePictureUrl: ''
  };

  oldUserData: any = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    profilePictureUrl: ''
  };

  passwordChangeData: any = {
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  loadingSpinner: boolean = false;

  constructor(public apiService: ApiService, private router: Router, public alertService: AlertService, private tokenCheckerService: TokenCheckerService) {}

  ngOnInit() {
    this.tokenCheckerService.redirectToLoginIfExpired();
    this.getAccountInformation();
  }

  profilePictureUrl: string = '';
  hasProfilePicture: boolean = false

  somethingChanged(): boolean {
    // console.log(this.userData)
    // console.log(this.oldUserData)
    // console.log("==========")
    const keys1 = Object.keys(this.oldUserData);
    const keys2 = Object.keys(this.userData);
    if (keys1.length !== keys2.length) {
      return true;
    }
    for (const key of keys1) {
      if (this.oldUserData[key] !== this.userData[key]) {
        return true;
      }
    }
  
    return false;
  }

  changePassword() {
    if (this.passwordChangeData.newPassword.length < 8) {
      this.alertService.show("error", "Passwords is too short")
    }
    if (this.passwordChangeData.newPassword != this.passwordChangeData.confirmNewPassword) {
      this.alertService.show("error", "Passwords do not match")
      return
    }
    this.apiService.changePassword({currentPassword:this.passwordChangeData.currentPassword, newPassword:this.passwordChangeData.newPassword}).subscribe(
      (response) => {
        if (response.code == 0) {
          // console.log("successfull password change")

          this.alertService.show("success", response.message)
          const changePasswordModal = document.getElementById('changePasswordModal') as HTMLDialogElement;
          changePasswordModal.close();
        } else {
          this.alertService.show("error", response.message)
        }
        // if (response.code == 0) {
        //   console.log(response)
        // } else if (response.code == 10){
        //   console.log(response)
        // } else if (response.code == 20){
        //   console.log(response)
        // } else if (response.code == 30){
        //   console.log(response)
        // } else if (response.code == 40){
        //   console.log(response)
        // } else if (response.code == 50){
        //   console.log(response)
        // } else {
        //   console.log("There was an error")
        // }
        // document.getElementById("usernameAvailability")
      },
      (error) => {
        console.log(error);
        this.alertService.show("error", "There was an error while changing the password")
      }
    );
  }

  checkAvailability(username: string) {
      var available = document.getElementById('usernameAvailable')
      var notAvailable = document.getElementById('usernameNotAvailable')
      if (username.length > 4 && this.oldUserData.username !== username) {
        // console.log(this.userData.username + " : " + this.oldUserData.username)
        this.apiService.availabilityCheck(username).subscribe(
          (response) => {
            if (response.code == 0) {
              available?.classList.remove('hidden')
              notAvailable?.classList.add('hidden')
            } else if (response.code == 10){
              available?.classList.add('hidden')
              notAvailable?.classList.remove('hidden')
            } else {
              console.log("There was an error")
            }
            // document.getElementById("usernameAvailability")
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        available?.classList.add('hidden')
        notAvailable?.classList.add('hidden')
      }


  }



  getAccountInformation() {
    this.apiService.getUserInformation().subscribe(
      (response) => {
        console.log(response);
        this.userData.first_name = response.first_name
        this.userData.last_name = response.last_name
        this.userData.username = response.username
        this.userData.email = response.email
        this.userData.profilePictureUrl = response.picture


        this.oldUserData.first_name = response.first_name
        this.oldUserData.last_name = response.last_name
        this.oldUserData.username = response.username
        this.oldUserData.email = response.email
        this.oldUserData.profilePictureUrl = response.picture

        if (response.picture != null) {
          this.hasProfilePicture = true
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }


  saveInformation() {
    var changedData: any = {};
    for (const key in this.userData) {
      if (this.userData.hasOwnProperty(key) && this.userData[key] !== this.oldUserData[key]) {
        changedData[key] = this.userData[key];
      }
    }

    this.apiService.changeUserinformation(changedData).subscribe(
      (response) => {
        this.loadingSpinner = false;
        if (response.code == 0) {
          this.alertService.show("success", response.message)
          this.oldUserData = { ...this.userData };
        } else {
          this.alertService.show("error", response.message)
        }
        // this.router.navigate(['/login']);
      },
      (error) => {
        // console.log(error);
        this.loadingSpinner = false;
        this.alertService.show("error", "There was an error")
      }
    );


  }

  cancelInformation() {
    window.history.back();
  }

  removeProfilePicture() {
    this.apiService.deleteProfilePicture().subscribe(
      (response) => {
        if (response.code == 0) {
          this.alertService.show("success", "Profile picture removed successfully");
          this.hasProfilePicture = false;
        } else {
          this.alertService.show("error", response.message)
        }

      },
      (error) => {
        this.alertService.show("error", "There was an error while uploading the picture");
        console.error(error);
      }
    );  }

  changeProfilePicture($event: any) {
    const file = $event.target.files[0];
    if (file) {
      this.apiService.changeProfilePicture(file).subscribe(
        (response) => {
          if (response.code == 0) {
            this.alertService.show("success", "Profile picture updated successfully");
            console.log(response);
            this.userData.profilePictureUrl = response.imageid;
            this.oldUserData.profilePictureUrl = response.imageid;
            this.hasProfilePicture = true;
          } else {
            this.alertService.show("error", response.message)
          }

        },
        (error) => {
          this.alertService.show("error", "There was an error while uploading the picture");
          console.error(error);
        }
      );
    }
  }


  doDeleteAccount() {
    this.loadingSpinner = true;
    this.apiService.deleteAccount().subscribe(
      (response) => {
        this.loadingSpinner = false;
        // console.log(response);
        if (response.code == 0) {
          this.alertService.show("success", "Account deleted successfully")
          document.getElementById('modalTitle')!.innerHTML = "Successfully deleted"
          document.getElementById('modalText')!.innerHTML = "Your accont has been deleted successfully. You will be redirected to the homepage now."
          document.getElementById('deleteButton')!.classList.add('hidden')
          setTimeout(() => {
            this.router.navigate(['/home']);;
          }, 3000);
        } else if (response.code == 99) {
          this.alertService.show("success", "Your token expired. Please login to delete your account.")
          // setTimeout(() => {
          //   this.router.navigate(['/login']);;
          // }, 3000);
        } else {
          console.log("else what")
        }
        // this.router.navigate(['/login']);
        //tbd logout
      },
      (error) => {
        console.log(error);
        this.loadingSpinner = false;
        this.alertService.show("error", "There was an error")
      }
    );
  }


}
