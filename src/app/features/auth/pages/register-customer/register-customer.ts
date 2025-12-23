import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IRegisterRequest } from '../../../../shared/models/user.model';

@Component({
  selector: 'app-register-customer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-customer.html',
  styleUrl: './register-customer.css',
})
export class RegisterCustomerComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);
  private themeService = inject(ThemeService);
  private cdr = inject(ChangeDetectorRef);

  get isDarkMode() {
    return this.themeService.isDarkMode();
  }

  registerForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
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
      if (fieldName === 'nationalId') return 'National ID must be exactly 14 digits';
      if (fieldName === 'phoneNumber') return 'Phone number is Invalid';
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

    this.auth.registerCustomer(this.registerForm.value as IRegisterRequest)
      .pipe(
        finalize(() => {
          console.log('Observable finalized (completed or errored)');
          this.loading = false;
          this.cdr.detectChanges(); // Force UI update
        })
      )
      .subscribe({
        next: (res) => {
          console.log('SUCCESS:', res);
          alert('Customer registration successful');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.log('ERROR CALLBACK TRIGGERED');
          console.log('FULL ERROR:', err);
          console.log('err.error:', err.error);
          console.log('err.error type:', typeof err.error);
          console.log('Is array:', Array.isArray(err.error));

          // Handle array format: [{ code: "...", description: "..." }]
          if (Array.isArray(err.error)) {
            const messages = err.error
              .map((e: { code?: string; description?: string }) => e.description)
              .filter((msg: string | undefined): msg is string => !!msg);
            if (messages.length > 0) {
              this.error = messages.join('\n');
              this.cdr.detectChanges(); // Force UI update
              return;
            }
          }

          const errorsObj = err.error?.errors as Record<string, string[]> | undefined;

          if (errorsObj) {
            Object.entries(errorsObj).forEach(([field, messages]) => {
              console.log(`Field: ${field}`, 'Messages:', messages);
            });

            const allMessages = Object.values(errorsObj).flat();

            this.error = allMessages.join('\n');
          } else if (err.error?.message) {
            this.error = err.error.message;
          } else {
            this.error = 'Registration failed, please check your data.';
          }
          this.cdr.detectChanges(); // Force UI update
        }
      });
  }

}

