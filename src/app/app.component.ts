import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { ThemeService } from './services/theme.service';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'web';

  constructor(private themeService: ThemeService) {
    this.themeService.setSavedTheme();
  }

  
}
