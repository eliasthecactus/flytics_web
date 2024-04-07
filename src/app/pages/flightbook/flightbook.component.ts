import { Component, Input, OnChanges, SimpleChanges, DoCheck, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AlertService } from '../../services/alert.service';
import { MapComponent } from '../../components/map/map.component';
import { MapService } from '../../services/map.service';
import { Router, RouterLink } from '@angular/router';
import { NgxChartsModule, LegendPosition }from '@swimlane/ngx-charts';
import { FunctionsService } from '../../services/functions.service';
import { Flight } from '../../modules/flight/flight.module';





@Component({
  selector: 'app-flightbook',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, MapComponent, RouterLink, NgxChartsModule],
  providers: [DatePipe, ApiService, MapService],
  templateUrl: './flightbook.component.html',
  styleUrl: './flightbook.component.css',
})

export class FlightbookComponent {
  filterParameter = {
    fromDateBool: false,
    formatedFromDate: "",
    distanceMin: 0,
    distanceMax: 100,
    distanceMinBool: false,
    distanceMaxBool: false,
    durationMinutesMin: 0,
    durationMinutesMax: 30,
    durationHoursMin: 0,
    durationHoursMax: 1,
    durationMinBool: false,
    durationMaxBool: false,
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

  sortColumn: string = 'start_time';
  sortDirection: string = 'asc';

  currentSelectedFlight: Partial<Flight> = {};

  detailFlightTab: boolean = true


  statsData: ({ name: string; value: number }[])[] = [];

  legendBelow: LegendPosition = LegendPosition.Below

  detailFlightCoordinates = [];
  detailFlightHeightProfile: any[] = [];
  detailFlightHeightProfileLoaded: boolean = false;

  


  getObjectKeys(obj: any): string[] {
    return Object.keys(obj);
  }


  constructor(private router: Router ,private datepipe: DatePipe, private cdr: ChangeDetectorRef, private apiService: ApiService, public alertService: AlertService, private mapService: MapService, public functions: FunctionsService) {

  }


  formatTime = (val: number) => {
    return val+"%"
  }



  compareFlight(flightId: number) {
    // console.log("Compare Flight Nr. "+flightId)
    this.router.navigate(['/compare'])
  }

  onSelect(event: any) {
    console.log(event);
  }

  downloadFlight(flightId: number, fileType: string) {
    this.apiService.downloadFlightFile(flightId, fileType)
    .subscribe((data: any) => {
        // Handle binary data (e.g., file download)
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `flight_${flightId}.${fileType.toLowerCase()}`;
        link.click();
        this.alertService.show("success", "Flight downloaded successfully");
    }, error => {
      // Handle error if needed
      this.alertService.show("error", "There was an error while downloading the flight");
      console.error('Error downloading file', error);
    });
  }

  // Function to handle sorting
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
    this.myFlights.sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (this.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return bValue > aValue ? 1 : -1;
      }
    });
  }

  ngAfterViewInit() {

  }

  floorNumber(numb: number): number {
    return Math.floor(numb);
  }


  filterSet() {
    if (this.filterParameter.locationBool || this.filterParameter.fromDateBool || this.filterParameter.toDateBool || this.filterParameter.distanceMaxBool || this.filterParameter.distanceMinBool) {
      return true;
    }
    return false;
  }


  clearFilter() {
    // console.log("clear filter")
    this.filterParameter = { ...this.originalFilter };

  }


  ngOnInit(): void {
    this.getLocation()
    this.filterParameter.formatedFromDate = this.datepipe.transform(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).getTime(), 'yyyy-MM-dd')!;
    this.filterParameter.formatedToDate = this.datepipe.transform(Date.now(), 'yyyy-MM-dd')!;
    // this.filterParameter.formatedFromDate = this.filterParameter.fromDate

  }

  openFlightMap():void {
    this.mapService.resizeMap('flightsMap')
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
    const hasDistanceMaxBoolChanged = previousFilterParameter.distanceMaxBool !== this.filterParameter.distanceMaxBool;
    const hasDistanceMinBoolChanged = previousFilterParameter.distanceMinBool !== this.filterParameter.distanceMinBool;
    const hasDistanceMaxChanged = previousFilterParameter.distanceMax !== this.filterParameter.distanceMax;
    const hasDistanceMinChanged = previousFilterParameter.distanceMin !== this.filterParameter.distanceMin;
    

    // Add more checks for other properties as needed
    if (hasFromDateChanged || hasToDateChanged || hasLocationBoolChanged || hasLocationRangeChanged || hasFormatedFromDateChanged || hasFormatedToDateChanged || hasLocationCoordinatesChanged || hasDistanceMinBoolChanged || hasDistanceMaxBoolChanged || hasDistanceMinChanged || hasDistanceMaxChanged) {
      // console.log(this.filterParameter);
      this.mapService.clearCircles("locationMap")
      this.mapService.addCircle("locationMap", this.filterParameter.locationCoordinates.lat, this.filterParameter.locationCoordinates.lng, this.filterParameter.locationRange*1000)

      this.loadFLights();
      // this.cdr.detectChanges();
    }
  
    // Update the previous state for the next check
    this._previousFilterParameter = { ...this.filterParameter };
  }

  realDateTime(raw_time: string, dst_offset: number, raw_offset: number) {
    const baseDate = new Date(raw_time + 'Z');

    // Calculate the total offset in milliseconds
    const totalOffset = (dst_offset + raw_offset) * 1000;
  
    // Create a new Date object by adding the total offset to the baseDate
    const adjustedDate = new Date(baseDate.getTime() + totalOffset);
  
    return adjustedDate;
  }

  showFlightDetail(flight: Flight) {
    const modal = document.getElementById('flightDetailModal') as HTMLDialogElement | null;

    if (modal) {
      this.currentSelectedFlight = flight;
      this.apiService.getFlightFile(flight.id, "geojson").subscribe(
        (geoJSONData) => {
          this.mapService.removeGeoJSONLayer('detailMap');
          this.mapService.addGeoJSONLayer('detailMap', geoJSONData);
          this.mapService.clearMarkers('detailMap');
          this.mapService.addMarker('detailMap', flight.start_lat, flight.start_long, "Start", "black")
          this.mapService.recenterMap('detailMap', this.currentSelectedFlight.start_lat!, this.currentSelectedFlight.start_long!, 12);
          this.detailFlightCoordinates = geoJSONData['features'][0]['geometry']['coordinates'];

          var tempList = []
          for (let i = 0; i < this.detailFlightCoordinates.length; i++) {
            const altitude = this.detailFlightCoordinates[i][2];
            // this.detailFlightHeightProfile.push(altitude);
            tempList.push({value: altitude, name: i.toString()})
          }
          // this.detailFlightHeightProfile.push({name: "Height Profile", series: tempList})
          this.detailFlightHeightProfile = [{name: "Height Profile", series: tempList}]

          this.detailFlightHeightProfile = [...this.detailFlightHeightProfile];

          // testset = [
          //   {
          //     "name": "Uzbekistan",
          //     "series": [
          //       {
          //         "value": 4836,
          //         "name": "1"
          //       },

          // console.log(this.detailFlightHeightProfile)
          this.detailFlightHeightProfileLoaded = true;

        modal.showModal();
        },
        (error) => {
          this.alertService.show("error", "There was an error while opening the flight")
          console.error('Error fetching GeoJSON:', error);
          // Handle error appropriately, e.g., show an error message
        }
      );

      // this.mapService.removeGeoJSONLayer("detailMap");
      // // tbd get geojson url
      // const geoJSONUrl = '';
      // this.mapService.addGeoJSONLayer("detailMap", geoJSONUrl);
      // this.mapService.recenterMap("detailMap", this.currentSelectedFlight.start_lat!, this.currentSelectedFlight.start_long!, 12);
      // modal.showModal();
    }
  }

  deleteFlight(flight_id: number) {
    this.apiService.deleteFlight(flight_id).subscribe(
      (response) => {
        // console.log(response)
        if (response.code == 0) {
          const modal = document.getElementById('flightDetailModal') as HTMLDialogElement | null;
          if (modal) {
            modal.close();
          }
          this.alertService.show("success", 'Flight #'+flight_id+' deleted successfully');
          this.loadFLights()
        } else {
          this.alertService.show("error", "There was an error while deleting the flight: "+response.message)
        }
      },
      (error) => {
        this.alertService.show("error", "There was an error while opening the flight")
        console.error('Error deleting flight:', error);
        // Handle error appropriately, e.g., show an error message
      }
    );
  }


  loadFLights() {
    this.flightsLoading = true;
    var filter: any = []

    filter.push("user="+localStorage.getItem('user_id'))

    if (this.filterParameter.locationBool) {
      filter.push("location_lat="+this.filterParameter.locationCoordinates.lat+"&location_long="+this.filterParameter.locationCoordinates.lng+"&location_range_max="+(1000*this.filterParameter.locationRange))
    }

    if (this.filterParameter.fromDateBool) {
      filter.push("start_date="+this.filterParameter.formatedFromDate)
    }

    if (this.filterParameter.distanceMaxBool) {
      filter.push("distance_max="+this.filterParameter.distanceMax*1000) //add one kilometer so the upper limit is also in there
    }

    if (this.filterParameter.distanceMinBool) {
      filter.push("distance_min="+this.filterParameter.distanceMin*1000)
    }

    // if (this.filterParameter.toDateBool) {
    //   filter.push("end_date="+this.filterParameter.formatedToDate)
    // }


    if (this.filterParameter.toDateBool) {
      // Add one day to the toDate
      const toDate = new Date(this.filterParameter.formatedToDate);
      toDate.setDate(toDate.getDate() + 1);
  
      filter.push("end_date=" + this.datepipe.transform(toDate, 'yyyy-MM-dd'));
    }




    this.apiService.getFlight(filter).subscribe(
      (response) => {
        // console.log(response);
        if (response.code == 0) {
          this.myFlights = response.flights;
          // console.log(this.myFlights)
          this.sortTable(this.sortColumn);
          this.statsData = [];
          this.statsData.push([{"name": "Flight Count", "value": this.myFlights.length}])
          var flightDistance = 0;
          for (const flight of this.myFlights) {
            flightDistance += flight.distance;
          }
          this.statsData.push([{"name": "Total Distance (km)", "value": parseInt((flightDistance/1000).toFixed(0))}])

        } else {
          this.alertService.show("error", response.message);
        }
      },
      (error) => {
        // console.log(error);
        this.alertService.show("error", "There was an error while loading the flights")
      },
      () => {
        this.mapService.clearMarkers('flightsMap');
        const addMarkersAsync = (flights: Flight[], index: number) => {
          if (index < flights.length) {
            const flight = flights[index];
            const flightMarker = this.mapService.addMarker('flightsMap',
            flight.start_lat,
            flight.start_long,
            `<div>Flight No.: #${flight.id.toString()}<br>Takeoff: ${this.datepipe.transform(this.realDateTime(flight.start_time, flight.timezone_raw_offset, flight.timezone_dst_offset), 'medium')}<br>Distance: ${(flight.distance / 1000).toFixed(2)}km</div>`
            );
            if (flightMarker !== null) {
              flightMarker.on('click', () => {
                this.showFlightDetail(flight);
              });
          
              // Add 'mouseover' event listener
              flightMarker.on('mouseover', () => {
                this.apiService.getFlightFile(flight.id, "geojson").subscribe(
                  (geoJSONData) => {
                    this.mapService.removeGeoJSONLayer('flightsMap');
                    this.mapService.addGeoJSONLayer('flightsMap', geoJSONData);
                  },
                  (error) => {
                    this.alertService.show("error", "There was an error while fetching the flight route")
                  }
                );
                // console.log("hover");
              });
          
              // Add 'mouseout' event listener
              flightMarker.on('mouseout', () => {
                // this.mapService.removeGeoJSONLayer('flightsMap');
                // console.log("unhover");
              });
            }
            setTimeout(() => addMarkersAsync(flights, index + 1), 0); // Add a delay of 0 milliseconds to make it asynchronous
          } else {
            this.flightsLoading = false;
          }
        };
        addMarkersAsync(this.myFlights, 0);
      }
      
    );
  }





  // changeLocation(event: google.maps.MapMouseEvent) {
  //   // this.markerPositions.push(event.latLng!.toJSON());
  //   let newMarkerPositions = [event.latLng!.toJSON()];
  //   this.marker.position = { lat: newMarkerPositions[0]['lat'], lng: newMarkerPositions[0]['lng']};
  //   // this.filterParameter.locationCoordinates.lat = newMarkerPositions[0]['lat']
  //   // this.filterParameter.locationCoordinates.lng = newMarkerPositions[0]['lng']
  //   this.filterParameter.locationCoordinates = { lat: newMarkerPositions[0]['lat'], lng: newMarkerPositions[0]['lng'] }
  //   console.log(this.marker.position)
  // }

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          var coord = position.coords;
          // this.marker.position = { lat: coord.latitude, lng: coord.longitude};
          // this.mapOptions.center = {lat: 46, lng: 46};
          this.filterParameter.locationCoordinates.lat = coord.latitude;
          this.filterParameter.locationCoordinates.lng = coord.longitude;
          // console.log(this.filterParameter)
          this.mapService.recenterMap('locationMap', coord.latitude, coord.longitude, 10);
          this.mapService.addMarker('locationMap', coord.latitude, coord.longitude)
          this.mapService.addCircle('locationMap', coord.latitude, coord.longitude, this.filterParameter.locationRange*1000)
          
        });
    } else {
       console.log("No support for geolocation")
    }
  }

  handleMapClick(event: any): void {
    // console.log('Map clicked at:', event);
    if (event.mapId == "locationMap") {
      this.mapService.clearMarkers(event.mapId)
      this.mapService.clearCircles(event.mapId)
      this.mapService.recenterMap(event.mapId, event.lat, event.lng)
      this.mapService.addMarker(event.mapId, event.lat, event.lng)
      this.mapService.addCircle(event.mapId, event.lat, event.lng, this.filterParameter.locationRange*1000)
      this.filterParameter.locationCoordinates = { lat: event.lat, lng: event.lng }
    }

  }

}
