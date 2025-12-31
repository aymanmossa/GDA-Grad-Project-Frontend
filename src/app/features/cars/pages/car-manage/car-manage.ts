import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CarService } from '../../../../core/services/car.service';
import {
  ICar,
  IMake,
  IModel,
  IBodyType,
  IFuelType,
  ILocation,
  CarCondition,
  CarGearType,
  DrivetrainType
} from '../../../../shared/models/car.model';

@Component({
  selector: 'app-car-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-manage.html',
  styleUrl: './car-manage.css'
})
export class CarManageComponent implements OnInit {
  private carService = inject(CarService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // lookups
  makes = signal<IMake[]>([]);
  models = signal<IModel[]>([]);
  bodyTypes = signal<IBodyType[]>([]);
  fuelTypes = signal<IFuelType[]>([]);
  locations = signal<ILocation[]>([]);

  // Enums for template
  CarCondition = CarCondition;
  CarGearType = CarGearType;
  DrivetrainType = DrivetrainType;

  carForm!: FormGroup;
  isEditMode = false;
  isLoading = false;
  currentCarId: string | null = null;
  errorMessage = signal<string | null>(null);

  uploadedFiles: any[] = [];
  originalImageUrls: string[] = []; // Track original images to detect deletions

  // Car license file
  carLicenseFile: File | null = null;
  carLicensePreview: string | null = null;
  existingCarLicenseUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.currentCarId = id;
      this.loadCar(id);
    }
  }

  private initForm() {
    const currentYear = new Date().getFullYear();
    this.carForm = this.fb.group({
      Year: [null, [Validators.required, Validators.min(1900), Validators.max(currentYear + 1)]],
      Price: [null, [Validators.required, Validators.min(1)]],

      Condition: [null, Validators.required],
      Mileage: [null, [Validators.required, Validators.min(0)]],
      LastInspectionDate: [null, Validators.required],
      GearType: [null, Validators.required],

      // New fields
      ExteriorColor: ['', [Validators.required, Validators.minLength(2)]],
      DrivetrainType: [null, Validators.required],
      EngineCapacity: [null, [Validators.required, Validators.min(100), Validators.max(20000)]],
      Horsepower: [null, [Validators.required, Validators.min(1), Validators.max(2000)]],

      MakeId: [null, Validators.required],
      ModelId: [null, Validators.required],
      BodyTypeId: [null, Validators.required],
      FuelId: [null, Validators.required],
      LocId: [null, Validators.required],
      Description: ['', [Validators.required, Validators.minLength(10)]],
      images: [null],
      carLicense: [null] // Car license image for admin approval
    });
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.carForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.carForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      const fieldLabels: Record<string, string> = {
        'Year': 'Release Year',
        'Price': 'Price',
        'Condition': 'Condition',
        'Mileage': 'Mileage',
        'LastInspectionDate': 'Inspection Date',
        'GearType': 'Transmission',
        'ExteriorColor': 'Color',
        'DrivetrainType': 'Drivetrain',
        'EngineCapacity': 'Engine Capacity',
        'Horsepower': 'Horsepower',
        'MakeId': 'Brand',
        'ModelId': 'Model',
        'BodyTypeId': 'Body Type',
        'FuelId': 'Fuel Type',
        'LocId': 'Location',
        'Description': 'Description'
      };
      return `${fieldLabels[fieldName] || 'This field'} is required`;
    }
    if (field.errors['min']) {
      if (fieldName === 'Year') return 'Year must be 1900 or later';
      if (fieldName === 'Price') return 'Price must be greater than 0';
      if (fieldName === 'Mileage') return 'Mileage cannot be negative';
      if (fieldName === 'EngineCapacity') return 'Engine capacity must be at least 100 cc';
      if (fieldName === 'Horsepower') return 'Horsepower must be at least 1';
      return `Minimum value is ${field.errors['min'].min}`;
    }
    if (field.errors['max']) {
      if (fieldName === 'Year') return `Year cannot exceed ${field.errors['max'].max}`;
      if (fieldName === 'EngineCapacity') return 'Engine capacity cannot exceed 20,000 cc';
      if (fieldName === 'Horsepower') return 'Horsepower cannot exceed 2,000';
      return `Maximum value is ${field.errors['max'].max}`;
    }
    if (field.errors['minlength']) {
      if (fieldName === 'ExteriorColor') return 'Color must be at least 2 characters';
      if (fieldName === 'Description') return 'Description must be at least 10 characters';
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }
    return 'Invalid value';
  }

  private loadLookups() {
    this.carService.getMakes().subscribe(res => this.makes.set(res));
    this.carService.getBodyTypes().subscribe(res => this.bodyTypes.set(res));
    this.carService.getFuelTypes().subscribe(res => this.fuelTypes.set(res));
    this.carService.getLocations().subscribe(res => this.locations.set(res));
  }

  private loadCar(id: string) {
    this.carService.getCarById(id).subscribe(res => {
      // Format date to YYYY-MM-DD for input[type=date]
      const inspectionDate = res.lastInspectionDate
        ? new Date(res.lastInspectionDate).toISOString().split('T')[0]
        : null;

      this.carForm.patchValue({
        Year: res.year,
        Price: res.price,

        Condition: res.condition,
        Mileage: res.mileage,
        LastInspectionDate: inspectionDate,
        GearType: res.gearType,

        // New fields
        ExteriorColor: res.exteriorColor,
        DrivetrainType: res.drivetrainType,
        EngineCapacity: res.engineCapacity,
        Horsepower: res.horsepower,

        MakeId: res.makeId,
        ModelId: res.modelId,
        BodyTypeId: res.bodyTypeId,
        FuelId: res.fuelId,
        LocId: res.locId,
        Description: res.description
      });

      this.uploadedFiles = [];
      this.originalImageUrls = []; // Reset original images
      if (res.imageUrls && res.imageUrls.length > 0) {
        res.imageUrls.forEach(imgUrl => {
          const fileName = imgUrl.split('/').pop();
          this.originalImageUrls.push(imgUrl); // Track original image
          this.uploadedFiles.push({
            file: null,
            name: fileName,
            originalName: imgUrl, // Store full path for backend
            previewUrl: 'https://carnest.runasp.net/' + imgUrl,
            isOld: true,
            progress: 100
          });
        });
      }
      this.updateFormImages();

      // Load models for the selected make
      if (res.makeId) {
        this.carService.getModelsByMake(res.makeId).subscribe(models => this.models.set(models));
      }

      // Load existing car license URL
      if (res.carLicenseUrl) {
        this.existingCarLicenseUrl = 'https://carnest.runasp.net/' + res.carLicenseUrl;
      }
    });
  }

  onMakeChange() {
    const selectedMakeId = this.carForm.get('MakeId')?.value;
    this.carForm.patchValue({ ModelId: null });
    this.models.set([]);

    if (selectedMakeId) {
      this.carService.getModelsByMake(Number(selectedMakeId)).subscribe(res => {
        this.models.set(res);
      });
    }
  }

  onSubmit() {
    if (this.carForm.invalid) {
      this.carForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const value = this.carForm.value;

    const formData = new FormData();

    formData.append('Year', String(value.Year));
    formData.append('Price', String(value.Price));

    formData.append('Condition', String(value.Condition));
    formData.append('Mileage', String(value.Mileage));
    formData.append('LastInspectionDate', String(value.LastInspectionDate));
    formData.append('GearType', String(value.GearType));

    // New fields
    formData.append('ExteriorColor', value.ExteriorColor ?? '');
    formData.append('DrivetrainType', String(value.DrivetrainType));
    formData.append('EngineCapacity', String(value.EngineCapacity));
    formData.append('Horsepower', String(value.Horsepower));

    formData.append('MakeId', String(value.MakeId));
    formData.append('ModelId', String(value.ModelId));

    if (value.BodyTypeId == null) {
      this.isLoading = false;
      alert('Please select a body type');
      return;
    }
    formData.append('BodyTypeId', String(value.BodyTypeId));

    formData.append('FuelId', String(value.FuelId));
    formData.append('LocId', String(value.LocId));
    formData.append('Description', value.Description ?? '');

    // Handle images: add new files and calculate deleted images
    const remainingOldImageUrls: string[] = [];
    this.uploadedFiles.forEach(f => {
      if (f.file) {
        // New image file
        formData.append('Images', f.file);
      } else if (f.isOld && f.originalName) {
        // Track which old images are still present
        remainingOldImageUrls.push(f.originalName);
      }
    });

    // Calculate which images were deleted (original - remaining)
    if (this.isEditMode && this.originalImageUrls.length > 0) {
      const deletedImages = this.originalImageUrls.filter(
        imgUrl => !remainingOldImageUrls.includes(imgUrl)
      );
      if (deletedImages.length > 0) {
        // Send as JSON string as expected by backend
        formData.append('imagesToDeleteJson', JSON.stringify(deletedImages));
        console.log('Images to delete:', deletedImages);
      }
    }

    // Car license file
    if (this.carLicenseFile) {
      formData.append('LicenseImage', this.carLicenseFile);
      console.log('Car license file attached:', this.carLicenseFile.name, this.carLicenseFile.type);
    } else {
      console.warn('No car license file selected!');
    }

    // Debug: Log all FormData entries
    console.log('FormData entries:');
    formData.forEach((value, key) => {
      console.log(`  ${key}:`, value instanceof File ? `[File: ${value.name}]` : value);
    });

    if (!this.isEditMode) {
      // create
      this.errorMessage.set(null);
      this.carService.createCar(formData).subscribe({
        next: (res: ICar) => {
          this.isLoading = false;
          this.router.navigate(['/cars', res.carId]);
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage.set(this.parseErrorMessage(err));
        }
      });
    } else if (this.currentCarId) {
      // update
      this.errorMessage.set(null);
      this.carService.updateCar(this.currentCarId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/cars', this.currentCarId!]);
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage.set(this.parseErrorMessage(err));
        }
      });
    }
  }

  // Parse error message from backend response
  private parseErrorMessage(err: any): string {
    // Handle array format: [{ code: "...", description: "..." }]
    if (Array.isArray(err.error)) {
      const messages = err.error
        .map((e: { code?: string; description?: string; message?: string }) => e.description || e.message)
        .filter((msg: string | undefined): msg is string => !!msg);
      if (messages.length > 0) {
        return messages.join('\n');
      }
    }

    // Handle object with errors field (validation errors)
    const errorsObj = err.error?.errors as Record<string, string[]> | undefined;
    if (errorsObj) {
      const allMessages = Object.values(errorsObj).flat();
      return allMessages.join('\n');
    }

    // Handle object with message field
    if (err.error?.message) {
      return err.error.message;
    }

    // Handle string error
    if (typeof err.error === 'string') {
      return err.error;
    }

    // Default message
    return 'An error occurred. Please check your data and try again.';
  }

  // ---------- files ----------
  onFileSelected(event: Event, index?: number) {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const fileData = {
        file,
        name: file.name,
        originalName: file.name,
        progress: 100,
        previewUrl: reader.result as string,
        isOld: false
      };

      if (index !== undefined) {
        this.uploadedFiles[index] = fileData;
      } else {
        this.uploadedFiles.push(fileData);
      }

      this.updateFormImages();
    };

    reader.readAsDataURL(file);
  }

  updateFormImages() {
    const finalFiles: any[] = [];

    this.uploadedFiles.forEach(f => {
      if (f.file) {
        finalFiles.push(f.file);
      } else if (f.isOld) {
        finalFiles.push(f.originalName);
      }
    });

    this.carForm.get('images')?.setValue(finalFiles);
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
    this.updateFormImages();
  }

  getFileType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase();
    if (!ext) return 'other';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'image';
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    return 'other';
  }

  // Car License file handling
  onCarLicenseSelected(event: Event) {
    console.log('onCarLicenseSelected triggered');
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      console.warn('No files in file input');
      return;
    }

    const file = files[0];
    this.carLicenseFile = file;
    console.log('Car license file set:', file.name, file.type, file.size);

    const reader = new FileReader();
    reader.onload = () => {
      this.carLicensePreview = reader.result as string;
      this.existingCarLicenseUrl = null; // Clear existing URL when new file is selected
      console.log('Car license preview set');
    };
    reader.readAsDataURL(file);
  }

  removeCarLicense() {
    this.carLicenseFile = null;
    this.carLicensePreview = null;
    this.existingCarLicenseUrl = null;
  }
}

