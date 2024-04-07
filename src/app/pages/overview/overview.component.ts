import { Component } from '@angular/core';
import { MapComponent } from '../../components/map/map.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MapComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent {

}
