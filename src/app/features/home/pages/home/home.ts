import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
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

  // Check if the current user is a customer
  isCustomer = computed(() => {
    const user = this.authService.currentUser();
    return user?.role === 'Customer';
  });
}

