import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapService } from '../../services/map.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, HttpClientModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
  providers: []
})
export class MapComponent implements AfterViewInit {
  @Input() mapId!: string;
  @Input() location: {lat: number, lng: number} = {lat: 47, lng: 8};
  @Input() zoom: number = 4;

  @Output() mapClick = new EventEmitter<any>();



  private map!: L.Map
  private marker!: L.Marker;

  // markers: L.Marker[] = [
  //   L.marker([31.9539, 35.9106]), // Amman
  //   L.marker([32.5568, 35.8469]), // Irbid
  //   L.marker([47, 8]) // Switzerland
  // ];

  constructor(private mapService: MapService) {

  }

  ngOnInit() {
    console.log(this.mapId)
  }


  ngAfterViewInit() {
    this.initializeMap();
    this.setupClickEvent();
    this.mapService.setMap(this.mapId, this.map);
  }


  private initializeMap() {
    const baseMapURl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
    const initialCenter = L.latLng(this.location.lat, this.location.lng);
  
    this.map = L.map(this.mapId, {
      center: initialCenter,
      zoom: this.zoom,
      attributionControl: false
    });

    var myAttrControl = L.control.attribution().addTo(this.map);
    myAttrControl.setPrefix('');
    L.tileLayer(baseMapURl, {attribution: '<a href="https://openstreetmap.org/copyright" target="_blank">© OpenStreetMap</a>'}).addTo(this.map);
  }




  // private addMarkers(marker: L.Marker) {
  //   const iconPath = 'assets/images/map/';

  //   const defaultIcon = new L.Icon({
  //     iconUrl: iconPath + 'marker-icon.png',
  //     iconRetinaUrl: iconPath + 'marker-icon-2x.png',
  //     iconSize: [25, 41],
  //     iconAnchor: [12, 41],
  //     popupAnchor: [1, -34],
  //     tooltipAnchor: [16, -28],
  //     shadowUrl: iconPath + 'marker-shadow.png',
  //     shadowSize: [41, 41],
  //   });

  //   // Set the custom icon for each marker
  //   marker.setIcon(defaultIcon);

  //   // Add your markers to the map
  //   marker.addTo(this.map);
  // }

  // private centerMap(coord: L.LatLngBoundsExpression) {
    
  //   // Fit the map view to the bounds
  //   this.map.fitBounds(coord);
  // }

  private setupClickEvent() {
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const lat = event.latlng.lat;
      const lng = event.latlng.lng;
      this.mapClick.emit({ lat: lat, lng: lng, mapId: this.mapId });
      // console.log(`Clicked at: Lat ${lat}, Lng ${lng}`);
    });
  }

}