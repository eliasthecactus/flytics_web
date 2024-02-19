import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  private maps: { [key: string]: { map: L.Map, markers: L.Marker[] } } = {};

  setMap(mapId: string, map: L.Map): void {
    this.maps[mapId] = { map, markers: [] };
  }

  addMarker(mapId: string, lat: number, lng: number, title = null): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      const marker = L.marker([lat, lng]);

      const iconPath = 'assets/images/map/';
      const defaultIcon = new L.Icon({
        iconUrl: iconPath + 'marker-icon.png',
        iconRetinaUrl: iconPath + 'marker-icon-2x.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: iconPath + 'marker-shadow.png',
        shadowSize: [41, 41],
      });

      if (title != null) {
        marker.bindTooltip(title)
      }

      marker.setIcon(defaultIcon)
      mapData.markers.push(marker);
      marker.addTo(mapData.map);
    }
  }

  clearMarkers(mapId: string): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      mapData.markers.forEach(marker => {
        marker.removeFrom(mapData.map);
      });
      mapData.markers = [];
    }
  }

  recenterMap(mapId: string, lat: number, lng: number, zoom: number): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      const newCenter = new L.LatLng(lat, lng);
      mapData.map.setView(newCenter, zoom);
    }
  }
}
