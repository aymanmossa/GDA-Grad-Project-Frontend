import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarService } from '../../../../core/services/car.service';
import { ICar } from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './car-details.html',
  styleUrl: './car-details.scss'
})
export class CarDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private carService = inject(CarService);

  car = signal<ICar | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error.set('Invalid car id');
      this.loading.set(false);
      return;
    }

    this.carService.getCarById(id).subscribe({
      next: (data) => {
        this.car.set(data);
        this.loading.set(false);
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
  }
}
