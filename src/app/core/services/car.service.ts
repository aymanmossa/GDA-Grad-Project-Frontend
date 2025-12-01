import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICar, CarFilter, IMake, IModel, IBodyType, IFuelType, ILocation } from '../../shared/models/car.model';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  private http = inject(HttpClient);
  private apiUrl = 'https://carnest.runasp.net/api/Car';

  getCars(filters: CarFilter): Observable<ICar[]> {
    let params = new HttpParams();

    // Dropdowns for Ids
    if (filters.makeId) params = params.set('makeId', filters.makeId);
    if (filters.modelId) params = params.set('modelId', filters.modelId);
    if (filters.bodyTypeId) params = params.set('bodyTypeId', filters.bodyTypeId);
    if (filters.fuelId) params = params.set('fuelId', filters.fuelId);
    if (filters.locId) params = params.set('locId', filters.locId);

    // Ranges
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice);
    if (filters.year) params = params.set('year', filters.year);

    return this.http.get<ICar[]>(`${this.apiUrl}/cars`, { params });
  }
  // Single Car details
  getCarById(id: string): Observable<ICar> {
    return this.http.get<ICar>(`${this.apiUrl}/cars/${id}`);
  }

  // Dropdowns
  getMakes() {
    return this.http.get<IMake[]>(`${this.apiUrl}/makes`);
  }

  // Fetch models based on the selected Make
  getModelsByMake(makeId: number) {
    return this.http.get<IModel[]>(`${this.apiUrl}/models?makeId=${makeId}`);
  }

  getBodyTypes() {
    return this.http.get<IBodyType[]>(`${this.apiUrl}/bodytypes`);
  }

  getFuelTypes() {
    return this.http.get<IFuelType[]>(`${this.apiUrl}/fueltypes`);
  }

  getLocations() {
    return this.http.get<ILocation[]>(`${this.apiUrl}/locations`);
  }


  // admin and vendor CRUD
  createCar(car: Partial<ICar>): Observable<ICar> {
    return this.http.post<ICar>(`${this.apiUrl}/cars`, car);
  }

  updateCar(id: string, car: Partial<ICar>): Observable<ICar> {
    return this.http.put<ICar>(`${this.apiUrl}/cars/${id}`, car);
  }

  deleteCar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cars/${id}`);
  }

  uploadCarImage(carId: string, files: File[]): Observable<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    return this.http.post(`${this.apiUrl}/cars/${carId}/images`, formData);
  }
}
