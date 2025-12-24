import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FavoriteService } from '../../../../core/services/favorite.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ICar, CarCondition, CarGearType } from '../../../../shared/models/car.model';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyPipe],
    templateUrl: './favorites.html',
    styleUrl: './favorites.css'
})
export class FavoritesComponent implements OnInit {
    private favoriteService = inject(FavoriteService);
    private authService = inject(AuthService);
    private router = inject(Router);

    loading = signal(true);
    CarCondition = CarCondition;
    CarGearType = CarGearType;

    get favorites() {
        return this.favoriteService.favorites();
    }

    get currentUser() {
        return this.authService.currentUser();
    }

    ngOnInit(): void {
        this.loadFavorites();
    }

    loadFavorites(): void {
        this.loading.set(true);
        this.favoriteService.loadFavorites().subscribe({
            next: () => {
                this.loading.set(false);
            },
            error: (err) => {
                console.error('Error loading favorites:', err);
                this.loading.set(false);
            }
        });
    }

    removeFromFavorites(carId: string, event: Event): void {
        event.preventDefault();
        event.stopPropagation();

        this.favoriteService.removeFromFavorites(carId).subscribe({
            next: () => {
                // Car is automatically removed from the favorites signal
            },
            error: (err) => {
                console.error('Failed to remove from favorites:', err);
                alert('Failed to remove from favorites. Please try again.');
            }
        });
    }

    viewDetails(carId: string): void {
        this.router.navigate(['/cars', carId]);
    }
}

