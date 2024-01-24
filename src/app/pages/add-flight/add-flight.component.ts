import { Component } from '@angular/core';

@Component({
  selector: 'app-add-flight',
  standalone: true,
  imports: [],
  templateUrl: './add-flight.component.html',
  styleUrl: './add-flight.component.css'
})
export class AddFlightComponent {



  addFlight() {
    console.log("add flight")
  }

  cancelAddFlight() {
    window.history.back();
  }

}
