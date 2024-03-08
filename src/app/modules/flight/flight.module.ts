import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Flight {
  id: number;
  country: string;
  country_code: string;
  distance: number;
  duration: number;
  end_height: number;
  igc_sum: string;
  info: null | any;
  location: string;
  public: boolean;
  start_height: number;
  start_lat: number;
  start_long: number;
  end_lat: number;
  end_long: number;
  max_height: number;
  min_height: number;
  start_time: string;
  timezone: string;
  timezone_dst_offset: number;
  timezone_raw_offset: number;
  uploaded: string;
  user: number;
}

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: []
})
export class FlightModule { }
