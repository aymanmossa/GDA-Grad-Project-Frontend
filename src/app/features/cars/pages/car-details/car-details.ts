import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarService } from '../../../../core/services/car.service';
import { ICar, CarCondition, CarGearType, DrivetrainType } from '../../../../shared/models/car.model';
import { AuthService } from '../../../../core/services/auth.service';
import { FavoriteService } from '../../../../core/services/favorite.service';


@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, NgClass],
  templateUrl: './car-details.html',
  styleUrl: './car-details.css'
})
export class CarDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private carService = inject(CarService);
  private auth = inject(AuthService);
  private favoriteService = inject(FavoriteService);

  car = signal<ICar | null>(null);
  loading = signal<boolean>(true);
  deleting = signal<boolean>(false);
  favoriting = signal<boolean>(false);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);

  // Suggested cars carousel (same brand)
  suggestedCars = signal<ICar[]>([]);
  loadingSuggestions = signal<boolean>(false);
  suggestionScrollIndex = signal(0);

  // Similar price cars carousel
  similarPriceCars = signal<ICar[]>([]);
  loadingSimilarPrice = signal<boolean>(false);
  similarPriceScrollIndex = signal(0);

  // Expose enums to template
  CarCondition = CarCondition;
  CarGearType = CarGearType;
  DrivetrainType = DrivetrainType;

  get canEdit(): boolean {
    const user = this.auth.currentUser();
    return !!user && user.role === 'Vendor';
  }

  get isAdmin(): boolean {
    const user = this.auth.currentUser();
    return !!user && user.role === 'Admin';
  }

  get canDelete(): boolean {
    // Admins can delete any car, vendors can delete their own cars
    return this.canEdit || this.isAdmin;
  }

  get isCustomer(): boolean {
    const user = this.auth.currentUser();
    return !!user && user.role === 'Customer';
  }

  get isFavorited(): boolean {
    const c = this.car();
    if (!c) return false;
    return this.favoriteService.isFavorite(c.carId);
  }

  toggleFavorite(): void {
    const c = this.car();
    if (!c) return;

    this.favoriting.set(true);
    this.favoriteService.toggleFavorite(c.carId).subscribe({
      next: () => {
        this.favoriting.set(false);
      },
      error: (err) => {
        console.error('Favorite toggle error:', err);
        this.favoriting.set(false);
        alert('Failed to update favorites. Please try again.');
      }
    });
  }

  ngOnInit(): void {
    // Subscribe to route parameter changes to reload data when navigating between cars
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      // Scroll to top on navigation
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      if (!id) {
        this.error.set('Invalid car id');
        this.loading.set(false);
        return;
      }

      // Reset state for new car
      this.loading.set(true);
      this.error.set(null);
      this.car.set(null);
      this.selectedImageIndex.set(0);
      this.suggestedCars.set([]);
      this.similarPriceCars.set([]);

      this.carService.getCarById(id).subscribe({
        next: (data) => {
          this.car.set(data);
          this.loading.set(false);
          // Load suggested cars from the same brand
          this.loadSuggestedCars(data.makeId, data.carId);
          // Load similar priced cars from all brands
          this.loadSimilarPricedCars(data.price, data.carId);
        },
        error: (err) => {
          console.error('Car details error:', err);
          if (err.status === 404) {
            this.error.set('Car not found');
          } else {
            this.error.set('Failed to load car details');
          }
          this.loading.set(false);
        }
      });
    });
  }

  private loadSuggestedCars(makeId: number, currentCarId: string): void {
    this.loadingSuggestions.set(true);
    this.carService.getSuggestedCars(makeId, currentCarId, 10).subscribe({
      next: (cars) => {
        this.suggestedCars.set(cars);
        this.suggestionScrollIndex.set(0);
        this.loadingSuggestions.set(false);
      },
      error: (err) => {
        console.error('Failed to load suggested cars:', err);
        this.loadingSuggestions.set(false);
      }
    });
  }

  // Carousel navigation for suggestions
  get visibleSuggestionsCount(): number {
    // Show 3 cards on desktop, 2 on tablet, 1 on mobile
    if (typeof window !== 'undefined') {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
    }
    return 1;
  }

  get canScrollPrevSuggestion(): boolean {
    return this.suggestionScrollIndex() > 0;
  }

  get canScrollNextSuggestion(): boolean {
    const totalCars = this.suggestedCars().length;
    const visibleCount = this.visibleSuggestionsCount;
    return this.suggestionScrollIndex() < totalCars - visibleCount;
  }

  scrollSuggestionPrev(): void {
    if (this.canScrollPrevSuggestion) {
      this.suggestionScrollIndex.update(i => i - 1);
    }
  }

  scrollSuggestionNext(): void {
    if (this.canScrollNextSuggestion) {
      this.suggestionScrollIndex.update(i => i + 1);
    }
  }

  // Similar price cars loading and navigation
  private loadSimilarPricedCars(price: number, currentCarId: string): void {
    this.loadingSimilarPrice.set(true);
    this.carService.getSimilarPricedCars(price, currentCarId, 10).subscribe({
      next: (cars) => {
        this.similarPriceCars.set(cars);
        this.similarPriceScrollIndex.set(0);
        this.loadingSimilarPrice.set(false);
      },
      error: (err) => {
        console.error('Failed to load similar priced cars:', err);
        this.loadingSimilarPrice.set(false);
      }
    });
  }

  get canScrollPrevSimilarPrice(): boolean {
    return this.similarPriceScrollIndex() > 0;
  }

  get canScrollNextSimilarPrice(): boolean {
    const totalCars = this.similarPriceCars().length;
    const visibleCount = this.visibleSuggestionsCount;
    return this.similarPriceScrollIndex() < totalCars - visibleCount;
  }

  scrollSimilarPricePrev(): void {
    if (this.canScrollPrevSimilarPrice) {
      this.similarPriceScrollIndex.update(i => i - 1);
    }
  }

  scrollSimilarPriceNext(): void {
    if (this.canScrollNextSimilarPrice) {
      this.similarPriceScrollIndex.update(i => i + 1);
    }
  }

  nextImage(): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    this.selectedImageIndex.update(current =>
      current + 1 >= images.length ? 0 : current + 1
    );
  }

  prevImage(): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    this.selectedImageIndex.update(current =>
      current - 1 < 0 ? images.length - 1 : current - 1
    );
  }

  setImage(index: number): void {
    const c = this.car();
    const images = c?.imageUrls ?? [];
    if (!images.length) return;

    if (index >= 0 && index < images.length) {
      this.selectedImageIndex.set(index);
    }
  }

  deleteCar(carId: string): void {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    this.deleting.set(true);
    this.carService.deleteCar(carId).subscribe({
      next: () => {
        this.deleting.set(false);
        alert('Car deleted successfully!');
        this.router.navigate(['/cars']);
      },
      error: (err) => {
        console.error('Delete car error:', err);
        this.deleting.set(false);
        alert('Failed to delete car. Please try again.');
      }
    });
  }

}

