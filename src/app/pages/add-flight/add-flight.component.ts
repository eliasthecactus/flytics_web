import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TokenCheckerService } from '../../services/token-checker.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-flight.component.html',
  providers: [TokenCheckerService, ApiService],
  styleUrl: './add-flight.component.css'
})
export class AddFlightComponent {

  constructor(private tokenChecker: TokenCheckerService) {}

  folderUpload: boolean = false;
  kmlFiles: File[] = [];
  privateFlight: boolean = false;
  flightInformation: String = '';

  onFileSelected(event: any) {
    const selectedFiles: FileList = event.target.files;
    this.kmlFiles = Array.from(selectedFiles).filter(file => {
      return (
        file.name.toLowerCase().endsWith('.kml') &&
        file.size <= (1024 * 1024) * 5 // 5MB in bytes
      );
    });
    // console.log('Selected Files:', this.kmlFiles);
  }

  toggleUploadType() {
    this.folderUpload = !this.folderUpload;
  }

  ngOnInit() {
    this.tokenChecker.redirectToLoginIfExpired();
  }



  addFlight() {
    console.log("add flight")
  }

  cancelAddFlight() {
    window.history.back();
  }

}
