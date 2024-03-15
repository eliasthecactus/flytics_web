import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { TokenCheckerService } from '../../services/token-checker.service';
import { AlertService } from '../../services/alert.service';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { Flight } from '../../modules/flight/flight.module';
import { NgxChartsModule, LegendPosition, id } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

interface User {
  first_name: string;
  last_name: string;
  picture: string;
  id: number;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [HttpClientModule, CommonModule, NgxChartsModule, FormsModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css',
  providers: [TokenCheckerService, ApiService],
})
export class CompareComponent {
  isReady = false;
  legendBelow: LegendPosition = LegendPosition.Below;

  flights: Flight[] = [];
  flightNumbers: number[] = [];

  addFlightId: string = '';
  addFlightName: string = '';
  availableUsers: User[] = [];

  gettingUsers: boolean = false;

  userSelected: User | null = null;

  availableFlights: Flight[] = [];
  flightSelected: Flight | null = null;

  sortColumn: string = 'start_time';
  sortDirection: string = 'asc';

  noFlightFound: boolean = false;

  constructor(
    private tokenChecker: TokenCheckerService,
    public alertService: AlertService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public apiService: ApiService
  ) {
    this.tokenChecker.redirectToLoginIfExpired();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['flightnumbers']) {
        var str_array = params['flightnumbers'].split(',');
        for (var i = 0; i < str_array.length; i++) {
          var cleanNumber = str_array[i].replace(/\D/g, '').trim();
          this.flightNumbers.push(cleanNumber);
        }
        if (cleanNumber.length > 0) {
          // console.log(this.flightNumbers);
          for (const flight of this.flightNumbers) {
            this.addFlight(flight);
          }
          this.isReady = true;
        } else {
          this.isReady = true;
        }
      } else {
        // console.log("failure")
      }
    });
  }

  realDateTime(raw_time: string, dst_offset: number, raw_offset: number) {
    const baseDate = new Date(raw_time + 'Z');

    // Calculate the total offset in milliseconds
    const totalOffset = (dst_offset + raw_offset) * 1000;

    // Create a new Date object by adding the total offset to the baseDate
    const adjustedDate = new Date(baseDate.getTime() + totalOffset);

    return adjustedDate;
  }

  floorNumber(numb: number): number {
    return Math.floor(numb);
  }

  addFlight(flightId: number) {
    this.noFlightFound = false;
    console.log('Add flight nr. ' + flightId.toString());
    var filter: any = [];
    filter.push('flight_id=' + flightId.toString());

    this.apiService.getFlight(filter).subscribe(
      (response) => {
        console.log(response);
        if (response.code == 0) {
          if (response.flights.length > 0) {
            this.flights.push(response.flights[0]);
            const changePasswordModal = document.getElementById('my_modal_2') as HTMLDialogElement;
            changePasswordModal.close();
            this.addFlightId = "";
            this.userSelected = null;
            this.addFlightName = "";
            this.addFlightNameChange("");
          } else {
            this.noFlightFound = true;
          }

          // this.statsData = [];
          // this.statsData.push([{"name": "Flight Count", "value": this.myFlights.length}])
        } else {
          this.alertService.show('error', response.message);
        }
      },
      (error) => {
        // console.log(error);
        this.alertService.show(
          'error',
          'There was an error while loading the flights'
        );
      },
      () => {
      }
    );
  }

  removeFlight(flightId: number) {
    for (let i = 0; i < this.flights.length; i++) {
      if (this.flights[i].id === flightId) {
        this.flights.splice(i, 1);
        break;
      }
    }
  }

  addFlightNameChange($event: any) {
    var name = $event.trim();
    if (name.length > 3) {
      this.gettingUsers = true;
      console.log($event);
      this.apiService.searchUser(name).subscribe(
        (response) => {
          if (response.code == 0) {
            this.availableUsers = response.users;
            console.log(this.availableUsers);
          } else {
            console.log('There was an error');
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          this.gettingUsers = false;
        }
      );
    } else {
      this.availableUsers = [];
    }
  }

  selectUser(user: User) {
    console.log(user.first_name);
    this.userSelected = user;

    var filter: any = [];
    filter.push('user=' + this.userSelected.id.toString());
    this.apiService.getFlight(filter).subscribe(
      (response) => {
        if (response.code == 0) {
          this.availableFlights = response.flights;
          this.sortTable(this.sortColumn);
          // console.log(response)
        } else {
          console.log('There was an error');
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSelect(event: any) {
    console.log(event);
  }

  closeCompare() {
    // window.history.back();
    this.router.navigate(['/dashboard/stats']);
  }

  sortTable(column: string) {
    // Toggle sort direction if the same column is clicked again
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the column to sort and default to ascending order
      this.sortColumn = column;
      this.sortDirection = 'desc';
    }

    // Apply sorting logic to your myFlights array
    this.availableFlights.sort((a, b) => {
      const aValue = (a as any)[column];
      const bValue = (b as any)[column];

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return bValue > aValue ? 1 : -1;
      }
    });
  }
}
