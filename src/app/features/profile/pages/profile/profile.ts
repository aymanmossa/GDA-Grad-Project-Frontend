import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class ProfileComponent {
    private authService = inject(AuthService);
    private themeService = inject(ThemeService);

    get currentUser() {
        return this.authService.currentUser();
    }

    get isDarkMode() {
        return this.themeService.isDarkMode();
    }

    // Format date for display
    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    // Get initials for avatar
    getInitials(): string {
        const user = this.currentUser;
        if (!user) return '?';
        const first = user.firstName?.charAt(0)?.toUpperCase() || '';
        const last = user.lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || user.email?.charAt(0)?.toUpperCase() || '?';
    }

    // Get role badge color
    getRoleBadgeClass(): string {
        const role = this.currentUser?.role;
        switch (role) {
            case 'Admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            case 'Vendor':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Customer':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        }
    }
}
