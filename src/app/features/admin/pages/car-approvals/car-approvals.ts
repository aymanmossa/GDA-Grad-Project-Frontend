import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../../../core/services/admin.service';
import { ICar, CarStatus } from '../../../../shared/models/car.model';

@Component({
    selector: 'app-car-approvals',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './car-approvals.html',
    styleUrl: './car-approvals.css'
})
export class CarApprovalsComponent implements OnInit {
    private adminService = inject(AdminService);

    // Car approvals
    pendingCars = signal<ICar[]>([]);
    rejectedCars = signal<ICar[]>([]);
    CarStatus = CarStatus;

    // Loading states
    isLoading = signal(false);
    isSaving = signal(false);

    ngOnInit(): void {
        this.loadPendingCars();
        this.loadRejectedCars();
    }

    loadPendingCars(): void {
        console.log('Loading pending cars...');
        this.adminService.getPendingCars().subscribe({
            next: (data: any) => {
                console.log('Pending cars API response:', data);
                const cars = Array.isArray(data) ? data : (data?.items || data?.data || []);
                console.log('Pending cars parsed:', cars);
                this.pendingCars.set(cars);
            },
            error: (err) => {
                console.error('Error loading pending cars:', err);
                this.pendingCars.set([]);
            }
        });
    }

    loadRejectedCars(): void {
        console.log('Loading rejected cars...');
        this.adminService.getRejectedCars().subscribe({
            next: (data: any) => {
                console.log('Rejected cars API response:', data);
                const cars = Array.isArray(data) ? data : (data?.items || data?.data || []);
                console.log('Rejected cars parsed:', cars);
                this.rejectedCars.set(cars);
            },
            error: (err) => {
                console.error('Error loading rejected cars:', err);
                this.rejectedCars.set([]);
            }
        });
    }

    approveCar(carId: string): void {
        this.isSaving.set(true);
        this.adminService.updateCarStatus(carId, CarStatus.Approved).subscribe({
            next: () => {
                this.loadPendingCars();
                this.loadRejectedCars();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    rejectCar(carId: string): void {
        this.isSaving.set(true);
        this.adminService.updateCarStatus(carId, CarStatus.Rejected).subscribe({
            next: () => {
                this.loadPendingCars();
                this.loadRejectedCars();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    getStatusLabel(status: CarStatus): string {
        switch (status) {
            case CarStatus.Pending: return 'Pending';
            case CarStatus.Approved: return 'Approved';
            case CarStatus.Rejected: return 'Rejected';
            default: return 'Unknown';
        }
    }

    getStatusClass(status: CarStatus): string {
        switch (status) {
            case CarStatus.Pending: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case CarStatus.Approved: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case CarStatus.Rejected: return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    }
}
