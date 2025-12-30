import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IMake, IModel, IBodyType, IFuelType, ILocation, ICar } from '../../shared/models/car.model';

export interface ICreateMake { makeName: string; }
export interface IUpdateMake { makeId: number; makeName: string; }
export interface ICreateModel { modelName: string; makeId: number; }
export interface IUpdateModel { modelId: number; modelName: string; makeId: number; }
export interface ICreateBodyType { name: string; }
export interface IUpdateBodyType { bodyId: number; name: string; }
export interface ICreateFuelType { name: string; }
export interface IUpdateFuelType { fuelId: number; name: string; }
export interface ICreateLocation { name: string; }
export interface IUpdateLocation { locId: number; name: string; }

@Injectable({
    providedIn: 'root',
})
export class AdminService {
    private http = inject(HttpClient);
    private baseUrl = 'https://carnest.runasp.net/api';

    // ==================== Makes ====================
    getMakes(): Observable<IMake[]> {
        return this.http.get<IMake[]>(`${this.baseUrl}/Make`);
    }

    createMake(data: ICreateMake): Observable<IMake> {
        return this.http.post<IMake>(`${this.baseUrl}/Make`, data);
    }

    updateMake(id: number, data: ICreateMake): Observable<IMake> {
        const payload: IUpdateMake = { makeId: id, makeName: data.makeName };
        return this.http.put<IMake>(`${this.baseUrl}/Make`, payload);
    }

    deleteMake(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Make/${id}`);
    }

    // ==================== Models ====================
    getModels(): Observable<IModel[]> {
        return this.http.get<IModel[]>(`${this.baseUrl}/Model`);
    }

    getModelsByMake(makeId: number): Observable<IModel[]> {
        return this.http.get<IModel[]>(`${this.baseUrl}/Model/by-make/${makeId}`);
    }

    createModel(data: ICreateModel): Observable<IModel> {
        return this.http.post<IModel>(`${this.baseUrl}/Model`, data);
    }

    updateModel(id: number, data: ICreateModel): Observable<IModel> {
        return this.http.put<IModel>(`${this.baseUrl}/Model/${id}`, data);
    }

    deleteModel(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/Model/${id}`);
    }

    // ==================== Body Types ====================
    getBodyTypes(): Observable<IBodyType[]> {
        return this.http.get<any[]>(`${this.baseUrl}/BodyType`);
    }

    createBodyType(data: ICreateBodyType): Observable<IBodyType> {
        return this.http.post<IBodyType>(`${this.baseUrl}/BodyType`, data);
    }

    updateBodyType(id: number, data: ICreateBodyType): Observable<IBodyType> {
        const payload: IUpdateBodyType = { bodyId: id, name: data.name };
        return this.http.put<IBodyType>(`${this.baseUrl}/BodyType`, payload);
    }

    deleteBodyType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/BodyType/${id}`);
    }

    // ==================== Fuel Types ====================
    getFuelTypes(): Observable<IFuelType[]> {
        return this.http.get<IFuelType[]>(`${this.baseUrl}/FuelType`);
    }

    createFuelType(data: ICreateFuelType): Observable<IFuelType> {
        return this.http.post<IFuelType>(`${this.baseUrl}/FuelType`, data);
    }

    updateFuelType(id: number, data: ICreateFuelType): Observable<IFuelType> {
        const payload: IUpdateFuelType = { fuelId: id, name: data.name };
        return this.http.put<IFuelType>(`${this.baseUrl}/FuelType`, payload);
    }

    deleteFuelType(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/FuelType/${id}`);
    }

    // ==================== Locations ====================
    getLocations(): Observable<ILocation[]> {
        return this.http.get<ILocation[]>(`${this.baseUrl}/LocationCity`);
    }

    createLocation(data: ICreateLocation): Observable<ILocation> {
        return this.http.post<ILocation>(`${this.baseUrl}/LocationCity`, data);
    }

    updateLocation(id: number, data: ICreateLocation): Observable<ILocation> {
        const payload: IUpdateLocation = { locId: id, name: data.name };
        return this.http.put<ILocation>(`${this.baseUrl}/LocationCity`, payload);
    }

    deleteLocation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/LocationCity/${id}`);
    }

    // ==================== Car Approvals ====================
    getPendingCars(): Observable<ICar[]> {
        return this.http.get<ICar[]>(`${this.baseUrl}/Car/pending`);
    }

    getRejectedCars(): Observable<ICar[]> {
        return this.http.get<ICar[]>(`${this.baseUrl}/Car/rejected`);
    }

    updateCarStatus(carId: string, status: number): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/Car/${carId}/status?status=${status}`, {});
    }
}
