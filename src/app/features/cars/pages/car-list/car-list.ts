import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CarService } from '../../../../core/services/car.service';
import { ICar, IMake, IModel, IBodyType, IFuelType, ILocation } from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './car-list.html', 
  styleUrl: './car-list.scss'
})
export class CarListComponent implements OnInit {
  private carService = inject(CarService);
  private fb = inject(FormBuilder);

  // --- Signals ---
  cars = signal<ICar[]>([]);
  makes = signal<IMake[]>([]);
  models = signal<IModel[]>([]);
  bodyTypes = signal<IBodyType[]>([]);
  fuelTypes = signal<IFuelType[]>([]);
  locations = signal<ILocation[]>([]);
  loading = signal<boolean>(false);

  // --- Filter Form ---
  filterForm = this.fb.group({
    search: [''],
    makeId: [''],
    modelId: [''],
    bodyTypeId: [''],
    fuelId: [''],
    locId: [''],
    minPrice: [''],
    maxPrice: [''],
    year: ['']
  });

  ngOnInit() {
    this.loadLookups();
    this.applyFilters(); 
  }

  loadLookups() {
    this.carService.getMakes().subscribe(res => this.makes.set(res));
    this.carService.getBodyTypes().subscribe(res => this.bodyTypes.set(res));
    this.carService.getFuelTypes().subscribe(res => this.fuelTypes.set(res));
    this.carService.getLocations().subscribe(res => this.locations.set(res));
  }

  onMakeChange() {
    const selectedMakeId = this.filterForm.get('makeId')?.value;
    this.filterForm.patchValue({ modelId: '' });
    this.models.set([]);

    if (selectedMakeId) {
      this.carService.getModelsByMake(Number(selectedMakeId)).subscribe(res => {
        this.models.set(res);
      });
    }
  }

  applyFilters() {
    this.loading.set(true);
    const raw = this.filterForm.getRawValue();
    
    // Clean data before sending
    const filters: any = { ...raw };
    if(filters.makeId) filters.makeId = Number(filters.makeId);
    if(filters.modelId) filters.modelId = Number(filters.modelId);
    
    this.carService.getCars(filters).subscribe({
      next: (data) => {
        this.cars.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.loading.set(false);
      }
    });
  }

  resetFilters() {
    this.filterForm.reset();
    this.models.set([]);
    this.applyFilters();
  }
}