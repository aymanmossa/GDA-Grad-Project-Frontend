import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { IMake, IModel, IBodyType, IFuelType, ILocation } from '../../../../shared/models/car.model';

type TabType = 'makes' | 'models' | 'bodyTypes' | 'fuelTypes' | 'locations';

interface EditableItem {
    id: number;
    name: string;
    parentId?: number;
    isEditing?: boolean;
    editName?: string;
    editParentId?: number;
}

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './admin-dashboard.html',
    styleUrl: './admin-dashboard.css'
})
export class AdminDashboardComponent implements OnInit {
    private adminService = inject(AdminService);

    // Active tab
    activeTab = signal<TabType>('makes');

    // Data signals
    makes = signal<EditableItem[]>([]);
    models = signal<EditableItem[]>([]);
    bodyTypes = signal<EditableItem[]>([]);
    fuelTypes = signal<EditableItem[]>([]);
    locations = signal<EditableItem[]>([]);

    // Loading states
    isLoading = signal(false);
    isSaving = signal(false);

    // New item form
    newItemName = '';
    newItemParentId: number | null = null;

    // Delete confirmation
    deleteConfirmId: number | null = null;
    deleteConfirmTab: TabType | null = null;

    // Filter for Models tab
    selectedMakeFilter: number | null = null;

    ngOnInit(): void {
        this.loadAllData();
    }

    loadAllData(): void {
        this.loadMakes();
        this.loadModels();
        this.loadBodyTypes();
        this.loadFuelTypes();
        this.loadLocations();
    }

    setActiveTab(tab: TabType): void {
        this.activeTab.set(tab);
        this.resetForm();
    }

    resetForm(): void {
        this.newItemName = '';
        this.newItemParentId = null;
        this.deleteConfirmId = null;
        this.deleteConfirmTab = null;
        // Reset filter when leaving models tab
        if (this.activeTab() !== 'models') {
            this.selectedMakeFilter = null;
        }
    }

    // ==================== Makes ====================
    loadMakes(): void {
        this.adminService.getMakes().subscribe({
            next: (data) => {
                this.makes.set(data.map(m => ({
                    id: m.makeId,
                    name: m.makeName,
                    isEditing: false,
                    editName: m.makeName
                })));
            }
        });
    }

    createMake(): void {
        if (!this.newItemName.trim()) return;
        this.isSaving.set(true);
        this.adminService.createMake({ makeName: this.newItemName.trim() }).subscribe({
            next: () => {
                this.loadMakes();
                this.newItemName = '';
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    updateMake(item: EditableItem): void {
        if (!item.editName?.trim()) return;
        this.isSaving.set(true);
        this.adminService.updateMake(item.id, { makeName: item.editName.trim() }).subscribe({
            next: () => {
                this.loadMakes();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    deleteMake(id: number): void {
        this.isSaving.set(true);
        this.adminService.deleteMake(id).subscribe({
            next: () => {
                this.loadMakes();
                this.loadModels(); // Reload models as they may be affected
                this.deleteConfirmId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    // ==================== Models ====================
    loadModels(): void {
        this.adminService.getModels().subscribe({
            next: (data) => {
                this.models.set(data.map(m => ({
                    id: m.modelId,
                    name: m.modelName,
                    parentId: m.makeId,
                    isEditing: false,
                    editName: m.modelName,
                    editParentId: m.makeId
                })));
            }
        });
    }

    createModel(): void {
        if (!this.newItemName.trim() || !this.newItemParentId) return;
        this.isSaving.set(true);
        this.adminService.createModel({
            modelName: this.newItemName.trim(),
            makeId: this.newItemParentId
        }).subscribe({
            next: () => {
                this.loadModels();
                this.newItemName = '';
                this.newItemParentId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    updateModel(item: EditableItem): void {
        if (!item.editName?.trim() || !item.editParentId) return;
        this.isSaving.set(true);
        this.adminService.updateModel(item.id, {
            modelName: item.editName.trim(),
            makeId: item.editParentId
        }).subscribe({
            next: () => {
                this.loadModels();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    deleteModel(id: number): void {
        this.isSaving.set(true);
        this.adminService.deleteModel(id).subscribe({
            next: () => {
                this.loadModels();
                this.deleteConfirmId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    getMakeName(makeId: number): string {
        const make = this.makes().find(m => m.id === makeId);
        return make?.name || 'Unknown';
    }

    // Get models filtered by selected brand
    getFilteredModels(): EditableItem[] {
        const allModels = this.models();
        if (this.selectedMakeFilter === null) {
            return allModels;
        }
        return allModels.filter(m => m.parentId === this.selectedMakeFilter);
    }

    onMakeFilterChange(): void {
        // Auto-set the newItemParentId when filter changes (for convenience)
        this.newItemParentId = this.selectedMakeFilter;
    }

    // ==================== Body Types ====================
    loadBodyTypes(): void {
        this.adminService.getBodyTypes().subscribe({
            next: (data: any[]) => {
                this.bodyTypes.set(data.map(b => ({
                    id: b.bodyId,
                    name: b.name,
                    isEditing: false,
                    editName: b.name
                })));
            }
        });
    }

    createBodyType(): void {
        if (!this.newItemName.trim()) return;
        this.isSaving.set(true);
        this.adminService.createBodyType({ name: this.newItemName.trim() }).subscribe({
            next: () => {
                this.loadBodyTypes();
                this.newItemName = '';
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    updateBodyType(item: EditableItem): void {
        if (!item.editName?.trim()) return;
        this.isSaving.set(true);
        this.adminService.updateBodyType(item.id, { name: item.editName.trim() }).subscribe({
            next: () => {
                this.loadBodyTypes();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    deleteBodyType(id: number): void {
        this.isSaving.set(true);
        this.adminService.deleteBodyType(id).subscribe({
            next: () => {
                this.loadBodyTypes();
                this.deleteConfirmId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    // ==================== Fuel Types ====================
    loadFuelTypes(): void {
        this.adminService.getFuelTypes().subscribe({
            next: (data) => {
                this.fuelTypes.set(data.map(f => ({
                    id: f.fuelId,
                    name: f.name,
                    isEditing: false,
                    editName: f.name
                })));
            }
        });
    }

    createFuelType(): void {
        if (!this.newItemName.trim()) return;
        this.isSaving.set(true);
        this.adminService.createFuelType({ name: this.newItemName.trim() }).subscribe({
            next: () => {
                this.loadFuelTypes();
                this.newItemName = '';
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    updateFuelType(item: EditableItem): void {
        if (!item.editName?.trim()) return;
        this.isSaving.set(true);
        this.adminService.updateFuelType(item.id, { name: item.editName.trim() }).subscribe({
            next: () => {
                this.loadFuelTypes();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    deleteFuelType(id: number): void {
        this.isSaving.set(true);
        this.adminService.deleteFuelType(id).subscribe({
            next: () => {
                this.loadFuelTypes();
                this.deleteConfirmId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    // ==================== Locations ====================
    loadLocations(): void {
        this.adminService.getLocations().subscribe({
            next: (data) => {
                this.locations.set(data.map(l => ({
                    id: l.locId,
                    name: l.name,
                    isEditing: false,
                    editName: l.name
                })));
            }
        });
    }

    createLocation(): void {
        if (!this.newItemName.trim()) return;
        this.isSaving.set(true);
        this.adminService.createLocation({ name: this.newItemName.trim() }).subscribe({
            next: () => {
                this.loadLocations();
                this.newItemName = '';
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    updateLocation(item: EditableItem): void {
        if (!item.editName?.trim()) return;
        this.isSaving.set(true);
        this.adminService.updateLocation(item.id, { name: item.editName.trim() }).subscribe({
            next: () => {
                this.loadLocations();
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    deleteLocation(id: number): void {
        this.isSaving.set(true);
        this.adminService.deleteLocation(id).subscribe({
            next: () => {
                this.loadLocations();
                this.deleteConfirmId = null;
                this.isSaving.set(false);
            },
            error: () => this.isSaving.set(false)
        });
    }

    // ==================== Utility Methods ====================
    startEdit(item: EditableItem): void {
        item.isEditing = true;
        item.editName = item.name;
        item.editParentId = item.parentId;
    }

    cancelEdit(item: EditableItem): void {
        item.isEditing = false;
        item.editName = item.name;
        item.editParentId = item.parentId;
    }

    confirmDelete(id: number, tab: TabType): void {
        this.deleteConfirmId = id;
        this.deleteConfirmTab = tab;
    }

    cancelDelete(): void {
        this.deleteConfirmId = null;
        this.deleteConfirmTab = null;
    }

    executeDelete(): void {
        if (!this.deleteConfirmId || !this.deleteConfirmTab) return;

        switch (this.deleteConfirmTab) {
            case 'makes':
                this.deleteMake(this.deleteConfirmId);
                break;
            case 'models':
                this.deleteModel(this.deleteConfirmId);
                break;
            case 'bodyTypes':
                this.deleteBodyType(this.deleteConfirmId);
                break;
            case 'fuelTypes':
                this.deleteFuelType(this.deleteConfirmId);
                break;
            case 'locations':
                this.deleteLocation(this.deleteConfirmId);
                break;
        }
    }

    saveEdit(item: EditableItem): void {
        switch (this.activeTab()) {
            case 'makes':
                this.updateMake(item);
                break;
            case 'models':
                this.updateModel(item);
                break;
            case 'bodyTypes':
                this.updateBodyType(item);
                break;
            case 'fuelTypes':
                this.updateFuelType(item);
                break;
            case 'locations':
                this.updateLocation(item);
                break;
        }
    }

    createItem(): void {
        switch (this.activeTab()) {
            case 'makes':
                this.createMake();
                break;
            case 'models':
                this.createModel();
                break;
            case 'bodyTypes':
                this.createBodyType();
                break;
            case 'fuelTypes':
                this.createFuelType();
                break;
            case 'locations':
                this.createLocation();
                break;
        }
    }

    getCurrentItems(): EditableItem[] {
        switch (this.activeTab()) {
            case 'makes':
                return this.makes();
            case 'models':
                return this.getFilteredModels();
            case 'bodyTypes':
                return this.bodyTypes();
            case 'fuelTypes':
                return this.fuelTypes();
            case 'locations':
                return this.locations();
        }
    }

    getTabTitle(): string {
        switch (this.activeTab()) {
            case 'makes':
                return 'Car Brands';
            case 'models':
                return 'Car Models';
            case 'bodyTypes':
                return 'Body Types';
            case 'fuelTypes':
                return 'Fuel Types';
            case 'locations':
                return 'Locations';
        }
    }

    getItemPlaceholder(): string {
        switch (this.activeTab()) {
            case 'makes':
                return 'Enter brand name...';
            case 'models':
                return 'Enter model name...';
            case 'bodyTypes':
                return 'Enter body type...';
            case 'fuelTypes':
                return 'Enter fuel type...';
            case 'locations':
                return 'Enter city name...';
        }
    }
}
