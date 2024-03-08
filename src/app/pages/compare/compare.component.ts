import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { TokenCheckerService } from '../../services/token-checker.service';
import { AlertService } from '../../services/alert.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Flight } from '../../modules/flight/flight.module';


@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css',
  providers: [TokenCheckerService, ApiService]
})
export class CompareComponent {

  isReady = false;

  flights: Flight[] = []
  flightNumbers: number[] = []

  constructor(private tokenChecker: TokenCheckerService, public alertService: AlertService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.tokenChecker.redirectToLoginIfExpired();
  }


  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['flightnumbers']) {
        var str_array = params['flightnumbers'].split(',');
        for (var i = 0; i < str_array.length; i++) {
          var cleanNumber = str_array[i].replace(/\D/g, '').trim();
          this.flightNumbers.push(cleanNumber)
        }
        if (cleanNumber.length > 0) {
          console.log(this.flightNumbers);
        }
      } else {
        // console.log("failure")
      }
    });
  }




  closeCompare() {
    window.history.back();
    // this.router.navigate(['/dashboard'])
  }


}
