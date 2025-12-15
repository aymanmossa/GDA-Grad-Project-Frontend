import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent {
  private themeService = inject(ThemeService);
  currentYear = new Date().getFullYear();

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }
}

