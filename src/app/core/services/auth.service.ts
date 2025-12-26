// src/app/core/services/auth.service.ts

import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import {
  IUser,
  IRegisterRequest,
  ILoginRequest,
  IAuthResponse,
  IUpdateProfileRequest,
  IChangePasswordRequest
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
      map(res => this.mapResponseToUser(res)),
      tap(user => this.handleSuccess(user))
    );
  }

  registerVendor(data: IRegisterRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/register/vendor`, data).pipe(
      map(res => this.mapResponseToUser(res)),
      tap(user => this.handleSuccess(user))
    );
  }

  login(credentials: ILoginRequest): Observable<IUser> {
    return this.http.post<IAuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
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
    return this.currentUser()?.token || localStorage.getItem('token') || null;
  }

  updateProfile(data: IUpdateProfileRequest): Observable<IUser> {
    const currentUserData = this.currentUser();
    // Get token from currentUser or fallback to localStorage
    const existingToken = currentUserData?.token || localStorage.getItem('token') || '';

    return this.http.put<any>(`${this.apiUrl}/profile`, data).pipe(
      map(() => {
        // Merge submitted data with existing user data (email and nationalId are not editable)
        const updatedUser: IUser = {
          id: currentUserData?.id || '',
          firstName: data.firstName,
          lastName: data.lastName,
          email: currentUserData?.email || '',
          nationalId: currentUserData?.nationalId || '',
          address: data.address,
          phoneNumber: data.phoneNumber,
          createdDate: currentUserData?.createdDate || new Date().toISOString(),
          role: currentUserData?.role || 'Customer',
          token: existingToken
        };
        return updatedUser;
      }),
      tap(user => this.handleSuccess(user))
    );
  }

  changePassword(data: IChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/change-password`, data);
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
