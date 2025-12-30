import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IRegisterRequest } from '../../../../shared/models/user.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-register-vendor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-vendor.html',
  styleUrl: './register-vendor.css',
})
export class RegisterVendorComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)]],
    lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/)]],
    nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
    address: ['', Validators.required],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]],
  });

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) return 'This field is required';
    if (field.errors['email']) return 'Please enter a valid email address';
    if (field.errors['minlength']) return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    if (field.errors['pattern']) {
      if (fieldName === 'firstName') return 'First name cannot contain numbers';
      if (fieldName === 'lastName') return 'Last name cannot contain numbers';
      if (fieldName === 'nationalId') return 'National ID must be exactly 14 digits';
      if (fieldName === 'phoneNumber') return 'Phone must be Egyptian format: 01(0|1|2|5)xxxxxxxx';
      if (fieldName === 'password') return 'Password must contain uppercase, lowercase, number, and symbol';
    }
    return 'Invalid value';
  }

  loading = false;
  error: string | null = null;
  showPassword = false;

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    this.auth.registerVendor(this.registerForm.value as IRegisterRequest)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          alert('Vendor registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {

          // Handle array format: [{ code: "...", description: "..." }]
          if (Array.isArray(err.error)) {
            const messages = err.error
              .map((e: { code?: string; description?: string }) => e.description)
              .filter((msg: string | undefined): msg is string => !!msg);
            if (messages.length > 0) {
              this.error = messages.join('\n');
              this.cdr.detectChanges();
              return;
            }
          }

          const errorsObj = err.error?.errors as Record<string, string[]> | undefined;

          if (errorsObj) {
            const allMessages = Object.values(errorsObj).flat();

            this.error = allMessages.join('\n');
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else {
            this.error = 'Registration failed, please check your data.';
          }
          this.cdr.detectChanges();
        }
      });
  }

}

