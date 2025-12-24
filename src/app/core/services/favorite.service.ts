import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { ICar } from '../../shared/models/car.model';

export interface IFavoriteResponse {
    carId: string;
    car?: ICar;
    // Flatten properties in case API returns flat structure
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private http = inject(HttpClient);
    private apiUrl = 'https://carnest.runasp.net/api/Favorite';

    // Signal to store favorited car IDs
    private _favoriteIds = signal<Set<string>>(new Set());

    // Signal to store full favorite cars data
    private _favorites = signal<ICar[]>([]);

    // Computed signal to expose favorite IDs
    favoriteIds = computed(() => this._favoriteIds());

    // Computed signal to expose favorites
    favorites = computed(() => this._favorites());

    // Check if a specific car is favorited
    isFavorite(carId: string): boolean {
        return this._favoriteIds().has(carId);
    }

    // Load user's favorites from API
    loadFavorites(): Observable<ICar[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map(response => {
                // Handle different API response formats
                if (!response || response.length === 0) {
                    return [];
                }

                // Check first item to determine structure
                const firstItem = response[0];

                // If the response contains a nested 'car' object
                if (firstItem && firstItem.car) {
                    return response.map(item => item.car as ICar);
                }

                // If the response is already an array of ICar objects
                if (firstItem && firstItem.carId && firstItem.makeName) {
                    return response as ICar[];
                }

                // If the response has different property names, try to map them
                return response.map(item => {
                    // Return as-is if it looks like ICar
                    if (item.carId) return item as ICar;
                    // Otherwise return empty to prevent errors
                    return item;
                });
            }),
            tap(cars => {
                this._favorites.set(cars);
                const ids = new Set(cars.map(c => c.carId).filter(id => id));
                this._favoriteIds.set(ids);
            }),
            catchError(err => {
                console.error('Error loading favorites:', err);
                return of([]);
            })
        );
    }

    // Add a car to favorites
    addToFavorites(carId: string): Observable<any> {
        return this.http.post(this.apiUrl, { carId }).pipe(
            tap(() => {
                const currentIds = new Set(this._favoriteIds());
                currentIds.add(carId);
                this._favoriteIds.set(currentIds);
            }),
            catchError(err => {
                console.error('Error adding to favorites:', err);
                throw err;
            })
        );
    }

    // Remove a car from favorites
    removeFromFavorites(carId: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${carId}`).pipe(
            tap(() => {
                const currentIds = new Set(this._favoriteIds());
                currentIds.delete(carId);
                this._favoriteIds.set(currentIds);

                // Also remove from favorites array
                const currentFavorites = this._favorites().filter(c => c.carId !== carId);
                this._favorites.set(currentFavorites);
            }),
            catchError(err => {
                console.error('Error removing from favorites:', err);
                throw err;
            })
        );
    }

    // Toggle favorite status
    toggleFavorite(carId: string): Observable<any> {
        if (this.isFavorite(carId)) {
            return this.removeFromFavorites(carId);
        } else {
            return this.addToFavorites(carId);
        }
    }

    // Clear favorites (for logout)
    clearFavorites(): void {
        this._favoriteIds.set(new Set());
        this._favorites.set([]);
    }
}

