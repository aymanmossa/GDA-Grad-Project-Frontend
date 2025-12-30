import { Routes } from '@angular/router';
import { CarListComponent } from './features/cars/pages/car-list/car-list';
import { HomeComponent } from './features/home/pages/home/home';
import { CarDetailsComponent } from './features/cars/pages/car-details/car-details';
import { LoginComponent } from './features/auth/pages/login/login';
import { authGuard } from './core/guards/auth-guard';
import { RegisterCustomerComponent } from './features/auth/pages/register-customer/register-customer';
import { RegisterVendorComponent } from './features/auth/pages/register-vendor/register-vendor';
import { CarManageComponent } from './features/cars/pages/car-manage/car-manage';
import { roleGuard } from './core/guards/role-guard';
import { guestGuard } from './core/guards/guest-guard';
import { FavoritesComponent } from './features/favorites/pages/favorites/favorites';
import { AdminDashboardComponent } from './features/admin/pages/admin-dashboard/admin-dashboard';
import { CarApprovalsComponent } from './features/admin/pages/car-approvals/car-approvals';
import { ProfileComponent } from './features/profile/pages/profile/profile';

export const routes: Routes = [
    {
        path: 'admin',
        component: AdminDashboardComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: ['Admin'] }
    },
    {
        path: 'car-approvals',
        component: CarApprovalsComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: ['Admin'] }
    },
    {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'cars',
        component: CarListComponent,
        canActivate: [authGuard]
    },

    {
        path: 'cars/:id',
        component: CarDetailsComponent

    },


    {
        path: 'login',
        component: LoginComponent,
        canActivate: [guestGuard]
    },

    {
        path: 'register-customer',
        component: RegisterCustomerComponent,
        canActivate: [guestGuard]
    },

    {
        path: 'register-vendor',
        component: RegisterVendorComponent,
        canActivate: [guestGuard]
    },

    {
        path: 'car-manage',
        component: CarManageComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: ['Vendor'] }
    },
    {
        path: 'car-manage/add',
        component: CarManageComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: ['Vendor'] }
    },
    {
        path: 'car-manage/:id',
        component: CarManageComponent,
        canActivate: [authGuard, roleGuard],
        data: { role: ['Vendor'] }
    },

    {
        path: 'favorites',
        component: FavoritesComponent,
        canActivate: [authGuard]
    },

    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },

    {
        path: '**',
        redirectTo: ''
    }
];
