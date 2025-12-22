// src/app/core/services/auth.service.ts

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import {
  IUser,
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse
} from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private apiUrl = 'https://carnest.runasp.net/api/Account';

  currentUser = signal<IUser | null>(null);

  constructor() {
    // Try to restore user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser) as IUser;
        this.currentUser.set(user);
      } catch {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
      }
    }
  }

  registerCustomer(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register/customer`, data).pipe(
      tap(res => console.log('Register Customer API Response:', res)),
      map(res => this.mapResponseToUser(res)),
      tap(user => this.handleSuccess(user))
    );
  }

  registerVendor(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register/vendor`, data).pipe(
      tap(res => console.log('Register Vendor API Response:', res)),
      map(res => this.mapResponseToUser(res)),
      tap(user => this.handleSuccess(user))
    );
  }

  login(credentials: ILoginRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => console.log('Login API Response:', res)),
      map(res => this.mapResponseToUser(res)),
      tap(user => this.handleSuccess(user))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private handleSuccess(user: IUser) {
    localStorage.setItem('token', user.token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUser.set(user);
  }

  get token(): string | null {
    return this.currentUser()?.token || null;
  }

  // Map API response directly to IUser (no JWT decoding needed)
  private mapResponseToUser(res: IAuthResponse): IUser {
    return {
      id: res.userId || '',
      firstName: res.firstName || '',
      lastName: res.lastName || '',
      email: res.email || '',
      nationalId: res.nationalId || '',
      address: res.address || '',
      phoneNumber: res.phoneNumber || '',
      createdDate: res.createdDate || new Date().toISOString(),
      role: (res.role || 'Customer') as 'Admin' | 'Vendor' | 'Customer',
      token: res.token
    };
  }
}
