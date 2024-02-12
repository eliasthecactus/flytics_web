import { Component, Input, OnChanges, SimpleChanges, DoCheck, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { GoogleMapsModule, GoogleMap, MapMarker, MapCircle } from '@angular/google-maps';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker, FormsModule, DatePipe, MapCircle],
  providers: [DatePipe, ApiService],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})

export class StatsComponent {
  marker = {
    position: { lat: 0, lng: 0 },
  }
  mapOptions: google.maps.MapOptions = {
    center: {lat: 0, lng: 0},
    zoom: 0,
    streetViewControl:false,
    // mapTypeId:google.maps.MapTypeId.HYBRID,
  };
  

  filterParameter = {
    fromDateBool: false,
    formatedFromDate: "",
    // fromDate: new Date('1970-01-01').getTime(),
    toDateBool: false,
    formatedToDate: "",
    locationBool: false,
    locationCoordinates: { lat: 0, lng: 0 },
    locationRange: 10
  };


  myFlights: any[] = [];
  filterOpen: boolean = false;
  private _previousFilterParameter: any = {};
  originalFilter: any = { ...this.filterParameter }; 
  flightsLoading: boolean = false; 


  constructor(private datepipe: DatePipe, private cdr: ChangeDetectorRef, private apiService: ApiService, public alertService: AlertService) {

  }

  floorNumber(numb: number): number {
    return Math.floor(numb);
  }


  filterSet() {
    if (this.filterParameter.locationBool || this.filterParameter.fromDateBool || this.filterParameter.toDateBool) {
      return true;
    }
    return false;
  }


  clearFilter() {
    console.log("clear filter")
    this.filterParameter = { ...this.originalFilter };

  }



  ngOnInit(): void {
    this.getLocation()
    this.filterParameter.formatedFromDate = this.datepipe.transform(new Date('1970-01-01').getTime(), 'yyyy-MM-dd')!;
    this.filterParameter.formatedToDate = this.datepipe.transform(Date.now(), 'yyyy-MM-dd')!;
    // this.filterParameter.formatedFromDate = this.filterParameter.fromDate
  }


  ngDoCheck(): void {
    const previousFilterParameter = { ...this._previousFilterParameter }; // Make a copy of the previous state
  
    // Check if specific properties have changed
    const hasFromDateChanged = previousFilterParameter.fromDateBool !== this.filterParameter.fromDateBool;
    const hasToDateChanged = previousFilterParameter.toDateBool !== this.filterParameter.toDateBool;
    const hasLocationBoolChanged = previousFilterParameter.locationBool !== this.filterParameter.locationBool;
    const hasLocationRangeChanged = previousFilterParameter.locationRange !== this.filterParameter.locationRange;
    const hasLocationCoordinatesChanged = previousFilterParameter.locationCoordinates !== this.filterParameter.locationCoordinates;
    const hasFormatedFromDateChanged = previousFilterParameter.formatedFromDate !== this.filterParameter.formatedFromDate;
    const hasFormatedToDateChanged = previousFilterParameter.formatedToDate !== this.filterParameter.formatedToDate;
    

    // Add more checks for other properties as needed
    if (hasFromDateChanged || hasToDateChanged || hasLocationBoolChanged || hasLocationRangeChanged || hasFormatedFromDateChanged || hasFormatedToDateChanged || hasLocationCoordinatesChanged) {
      console.log(this.filterParameter);
      this.loadFLights();
      this.cdr.detectChanges();
    }
  
    // Update the previous state for the next check
    this._previousFilterParameter = { ...this.filterParameter };
  }


  loadFLights() {
    this.flightsLoading = true;
    var filter: any = []

    filter.push("user=3")

    if (this.filterParameter.locationBool) {
      filter.push("location_lat="+this.filterParameter.locationCoordinates.lat+"&location_long="+this.filterParameter.locationCoordinates.lng+"&location_range_max="+(1000*this.filterParameter.locationRange))
    }

    if (this.filterParameter.fromDateBool) {
      filter.push("start_date="+this.filterParameter.formatedFromDate)
    }

    if (this.filterParameter.toDateBool) {
      filter.push("end_date="+this.filterParameter.formatedToDate)
    }


    this.apiService.getFlight(filter).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          this.myFlights = response.flights;
          console.log(this.myFlights)
        } else {
          this.alertService.show("error", response.message);
        }
      },
      (error) => {
        // console.log(error);
        this.alertService.show("error", "There was an error while loading the flights")
      },
      () => {
        this.flightsLoading = false;
      }
    );
  }



  changeLocation(event: google.maps.MapMouseEvent) {
    // this.markerPositions.push(event.latLng!.toJSON());
    let newMarkerPositions = [event.latLng!.toJSON()];
    this.marker.position = { lat: newMarkerPositions[0]['lat'], lng: newMarkerPositions[0]['lng']};
    // this.filterParameter.locationCoordinates.lat = newMarkerPositions[0]['lat']
    // this.filterParameter.locationCoordinates.lng = newMarkerPositions[0]['lng']
    this.filterParameter.locationCoordinates = { lat: newMarkerPositions[0]['lat'], lng: newMarkerPositions[0]['lng'] }
    console.log(this.marker.position)
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          var coord = position.coords;
          this.marker.position = { lat: coord.latitude, lng: coord.longitude};
          this.mapOptions.center = {lat: 46, lng: 46};
          this.filterParameter.locationCoordinates.lat = coord.latitude;
          this.filterParameter.locationCoordinates.lng = coord.longitude;
          
        });
    } else {
       console.log("No support for geolocation")
    }
  }

}
