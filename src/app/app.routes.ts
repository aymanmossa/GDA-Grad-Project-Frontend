import { Routes } from '@angular/router';
import { CarListComponent } from './features/cars/pages/car-list/car-list';
import { authGuardGuard } from './core/guards/auth.guard-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'cars',
        pathMatch: 'full'
    },
    {
        path: 'cars',
        component: CarListComponent,
    },
    {
        path: '**',
        redirectTo: 'cars',
    },

    // Auth Routes
    
    //// any role 
    // {
    //     path: 'profile',
    //     component: ProfileComponent,
    //     canActivate: [authGuardGuard]
    // },

    //// vendor role
    // {
    //     path: 'vendor/dashboard',
    //     component: VendorDashboardComponent,
    //     canActivate: [authGuardGuard],
    //     data: {role: ['Vendor']}
    // }

    //// admin role
    // {
    //     path: 'admin/dashboard',
    //     component: AdminDashboardComponent,
    //     canActivate: [authGuardGuard],
    //     data: {role: ['Admin']}
    // }


];
