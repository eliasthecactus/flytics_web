import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }


  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371000.0;

    function toRadians(degrees: number) {
        return degrees * (Math.PI / 180);
    }

    const [rLat1, rLon1, rLat2, rLon2] = [lat1, lon1, lat2, lon2].map(toRadians);

    const dLat = rLat2 - rLat1;
    const dLon = rLon2 - rLon1;

    const a = Math.sin(dLat / 2) ** 2 + Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }

}
