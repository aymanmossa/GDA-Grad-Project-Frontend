import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);
  private adminService = inject(AdminService);

  mobileMenuOpen = signal(false);
  pendingCarsCount = signal(0);

  get currentUser() {
    return this.authService.currentUser();
  }

  get isAuthenticated() {
    return !!this.authService.token;
  }

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  get isCustomer() {
    return this.isAuthenticated && this.currentUser?.role === 'Customer';
  }

  get isAdmin() {
    return this.isAuthenticated && this.currentUser?.role === 'Admin';
  }

  get isVendor() {
    return this.isAuthenticated && this.currentUser?.role === 'Vendor';
  }

  ngOnInit() {
    // Load pending cars count for admin
    if (this.isAdmin) {
      this.loadPendingCarsCount();
    }

    // Toggle mobile menu
    if (typeof document !== 'undefined') {
      const button = document.getElementById('mobile-menu-button');
      const menu = document.getElementById('mobile-menu');

      if (button && menu) {
        button.addEventListener('click', () => {
          this.mobileMenuOpen.update(val => !val);
          menu.classList.toggle('hidden');
        });
      }
    }
  }

  loadPendingCarsCount() {
    this.adminService.getPendingCars().subscribe({
      next: (data: any) => {
        const cars = Array.isArray(data) ? data : (data?.items || data?.data || []);
        this.pendingCarsCount.set(cars.length);
      },
      error: () => {
        this.pendingCarsCount.set(0);
      }
    });
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(val => !val);
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }
}

