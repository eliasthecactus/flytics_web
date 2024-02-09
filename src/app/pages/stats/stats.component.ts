import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { GoogleMapsModule, GoogleMap, MapMarker } from '@angular/google-maps';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, GoogleMap, MapMarker, FormsModule, DatePipe],
  providers: [DatePipe],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css',
})

export class StatsComponent implements OnChanges {
  marker = {
    position: { lat: 0, lng: 0 },
  }
  mapOptions: google.maps.MapOptions = {
    center: this.marker.position,
    zoom: 4
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

  selectedDate: string = "";

  constructor(private datepipe: DatePipe) {

  }



  ngOnInit(): void {
    this.getLocation()
    this.filterParameter.formatedFromDate = this.datepipe.transform(new Date('1970-01-01').getTime(), 'yyyy-MM-dd')!;
    this.filterParameter.formatedToDate = this.datepipe.transform(Date.now(), 'yyyy-MM-dd')!;
    // this.filterParameter.formatedFromDate = this.filterParameter.fromDate
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterParameter']) {
      console.log('filterParameter changed:', changes['filterParameter'].currentValue);
    }
  }


  

  check() {
    console.log(this.filterParameter)
  }


  changeLocation(event: google.maps.MapMouseEvent) {
    // this.markerPositions.push(event.latLng!.toJSON());
    let newMarkerPositions = [event.latLng!.toJSON()];
    this.marker.position = { lat: newMarkerPositions[0]['lat'], lng: newMarkerPositions[0]['lng']};
    this.filterParameter.locationCoordinates.lat = newMarkerPositions[0]['lat']
    this.filterParameter.locationCoordinates.lng = newMarkerPositions[0]['lng']
    console.log(this.marker.position)
  }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          var longitude = position.coords.longitude;
          var latitude = position.coords.latitude;
          this.marker.position.lat = latitude;
          this.marker.position.lng = longitude;
        });
    } else {
       console.log("No support for geolocation")
    }
  }

}
