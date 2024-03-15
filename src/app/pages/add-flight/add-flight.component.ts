import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenCheckerService } from '../../services/token-checker.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { forkJoin, tap } from 'rxjs';
import { Route, RouterLink, Router } from '@angular/router';


interface uploadState {
  code: Number;
  message: string;
  file: File
}

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  templateUrl: './add-flight.component.html',
  providers: [TokenCheckerService, ApiService],
  styleUrl: './add-flight.component.css'
})
export class AddFlightComponent {
  constructor(
    private tokenChecker: TokenCheckerService,
    private apiService: ApiService,
    public alertService: AlertService,
    private router: Router
  ) {
    this.tokenChecker.redirectToLoginIfExpired();
  }

  folderUpload: boolean = false;
  igcFiles: File[] = [];
  privateFlight: boolean = false;
  flightInformation: String = '';
  whileUploading = false;
  uploadStatus: uploadState[] = [];
  selectedFiles: File[] = [];
  uploadedFiles: number = 0;
  uploadFinished: boolean = false;
  

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.igcFiles = Array.from(this.selectedFiles).filter((file) => {
      return file.name.toLowerCase().endsWith('.igc'); //&& file.size <= (1024 * 1024) * 5 // 5MB in bytes
    });
  }

  toggleUploadType() {
    this.folderUpload = !this.folderUpload;
  }

  togglePrivate() {
    this.privateFlight = !this.privateFlight;
  }

  ngOnInit() {
    
  }

  addFlight() {
    this.whileUploading = true;
    this.uploadStatus.splice(0, this.uploadStatus.length);
    console.log(this.privateFlight)

    const uploadObservables = this.igcFiles.map((file) =>
    this.apiService.uploadFlight(file, this.privateFlight).pipe(
      tap((response) => {
        this.uploadedFiles++;
      })
    )
  );

    forkJoin(uploadObservables).subscribe(
      (responses) => {
        responses.forEach((response) => {
          const newEntry: uploadState = {
            code: response.code,
            message: response.message,
            file: response.file,
          };
          this.uploadStatus.push(newEntry);

        });
        console.log(this.uploadStatus);
      },
      (error) => {
        this.alertService.show('error', 'There was an error while uploading');
        console.error(error);
      },
      () => {
        this.uploadFinished = true;
      }
    );
  }

  cancelAddFlight() {
    window.history.back();
    // this.router.navigate(['/dashboard'])
  }
}
