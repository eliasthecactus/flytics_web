import { Injectable, Output, EventEmitter } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as L from 'leaflet';
import { CommonModule } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class MapService {


  constructor() { }

  private maps: { [key: string]: { map: L.Map; markers: L.Marker[]; circles: L.Circle[]; geoJSONLayer?: L.GeoJSON } } = {};


  setMap(mapId: string, map: L.Map): void {
    this.maps[mapId] = { map, markers: [], circles: [] };
  }


  addGeoJSONLayer(mapId: string, geoJSONData: any): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      if (mapData.geoJSONLayer) {
        this.removeGeoJSONLayer(mapId);
      }
  
      // Assuming geoJSONData is already a valid GeoJSON object
      mapData.geoJSONLayer = L.geoJSON(geoJSONData).addTo(mapData.map);
    }
  }

  removeGeoJSONLayer(mapId: string): void {
    const mapData = this.maps[mapId];
    if (mapData && mapData.geoJSONLayer) {
      mapData.geoJSONLayer.removeFrom(mapData.map);
      mapData.geoJSONLayer = undefined;
    }
  }


  addMarker(mapId: string, lat: number, lng: number, title: any = null, markerColor: string = ""): L.Marker | null {
    const mapData = this.maps[mapId];
    if (mapData) {
      const marker = L.marker([lat, lng]);
      if (markerColor != "") {
        markerColor = "-"+markerColor
      }
  
      const iconPath = 'assets/images/map/';
      const defaultIcon = new L.Icon({
        iconUrl: iconPath + `marker-icon${markerColor}.png`,
        iconRetinaUrl: iconPath + `marker-icon-2x${markerColor}.png`,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowUrl: iconPath + 'marker-shadow.png',
        shadowSize: [41, 41],
      });
  
      if (title != null) {
        marker.bindTooltip(title);
      }
  
      marker.setIcon(defaultIcon);
      mapData.markers.push(marker);
      marker.addTo(mapData.map);
  
      return marker; // Return the created marker
    }
  
    return null; // Return null if mapData is not found
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

  addCircle(mapId: string, lat: number, lng: number, radius: number): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      const circle = L.circle([lat, lng], {
        radius: radius,
      });

      mapData.circles.push(circle);
      circle.addTo(mapData.map);
    }
  }

  clearCircles(mapId: string): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      mapData.circles.forEach((circle) => {
        circle.removeFrom(mapData.map);
      });
      mapData.circles = [];
    }
  }

  recenterMap(mapId: string, lat: number, lng: number, zoom?: number): void {
    const mapData = this.maps[mapId];
    if (mapData) {
      const newCenter = new L.LatLng(lat, lng);
      const currentZoom = mapData.map.getZoom();

      if (zoom !== undefined) {
        mapData.map.setView(newCenter, zoom);
      } else {
        mapData.map.setView(newCenter, currentZoom);
      }
    }
  }

  resizeMap(mapId: string) {
    const mapData = this.maps[mapId]
    if (mapData) {
      mapData.map.invalidateSize()
    }
  }
}
