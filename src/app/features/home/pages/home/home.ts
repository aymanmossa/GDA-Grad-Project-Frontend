import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  private authService = inject(AuthService);

  // Check if the current user is a vendor
  isVendor = computed(() => {
    const user = this.authService.currentUser();
    return user?.role === 'Vendor';
  });

  constructor() {
    console.log('HomeComponent initialized');
  }
}

