import { Routes } from '@angular/router';
import { CarListComponent } from './features/cars/pages/car-list/car-list';
import { HomeComponent } from './features/home/pages/home/home';
import { CarDetailsComponent } from './features/cars/pages/car-details/car-details';

export const routes: Routes = [
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
        component: CarListComponent
    },
    
    {
        path: 'cars/:id',
        component: CarDetailsComponent
        
    },


    //   {
    //     path: 'cars/:id',
    //     // component: CarDetailComponent,
    //   },
    //   {
    //     path: 'cars/sell',
    //     // component: CarSellComponent,
    //   },

    {
        path: '**',
        redirectTo: ''
    }
];
