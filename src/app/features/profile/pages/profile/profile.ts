import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { IUpdateProfileRequest, IChangePasswordRequest } from '../../../../shared/models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, RouterLink, ReactiveFormsModule],
    templateUrl: './profile.html',
    styleUrl: './profile.css',
})
export class ProfileComponent {
    private authService = inject(AuthService);
    private themeService = inject(ThemeService);
    private fb = inject(FormBuilder);

    // Modal states
    showEditModal = signal(false);
    showPasswordModal = signal(false);

    // Loading and message states
    isLoading = signal(false);
    successMessage = signal('');
    errorMessage = signal('');

    // Edit Profile Form
    // Edit Profile Form (email and nationalId are not editable)
    profileForm: FormGroup = this.fb.group({
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        address: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]]
    });

    // Change Password Form
    passwordForm: FormGroup = this.fb.group({
        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmNewPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });

    get currentUser() {
        return this.authService.currentUser();
    }

    get isDarkMode() {
        return this.themeService.isDarkMode();
    }

    // Password match validator
    passwordMatchValidator(form: FormGroup) {
        const newPassword = form.get('newPassword')?.value;
        const confirmNewPassword = form.get('confirmNewPassword')?.value;
        if (newPassword !== confirmNewPassword) {
            form.get('confirmNewPassword')?.setErrors({ passwordMismatch: true });
            return { passwordMismatch: true };
        }
        return null;
    }

    // Format date for display
    formatDate(dateString: string): string {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    // Get initials for avatar
    getInitials(): string {
        const user = this.currentUser;
        if (!user) return '?';
        const first = user.firstName?.charAt(0)?.toUpperCase() || '';
        const last = user.lastName?.charAt(0)?.toUpperCase() || '';
        return first + last || user.email?.charAt(0)?.toUpperCase() || '?';
    }

    // Get role badge color
    getRoleBadgeClass(): string {
        const role = this.currentUser?.role;
        switch (role) {
            case 'Admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            case 'Vendor':
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Customer':
            default:
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
        }
    }

    // Modal controls
    openEditModal() {
        const user = this.currentUser;
        if (user) {
            this.profileForm.patchValue({
                firstName: user.firstName,
                lastName: user.lastName,
                address: user.address,
                phoneNumber: user.phoneNumber || ''
            });
        }
        this.clearMessages();
        this.showEditModal.set(true);
    }

    closeEditModal() {
        this.showEditModal.set(false);
        this.clearMessages();
    }

    openPasswordModal() {
        this.passwordForm.reset();
        this.clearMessages();
        this.showPasswordModal.set(true);
    }

    closePasswordModal() {
        this.showPasswordModal.set(false);
        this.clearMessages();
    }

    clearMessages() {
        this.successMessage.set('');
        this.errorMessage.set('');
    }

    // Save profile
    saveProfile() {
        if (this.profileForm.invalid) {
            this.profileForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.clearMessages();

        // Include email and nationalId from currentUser (required by backend but not editable)
        const data: IUpdateProfileRequest = {
            ...this.profileForm.value,
            email: this.currentUser?.email || '',
            nationalId: this.currentUser?.nationalId || ''
        };

        this.authService.updateProfile(data).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('Profile updated successfully!');
                setTimeout(() => {
                    this.closeEditModal();
                }, 1500);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to update profile. Please try again.');
            }
        });
    }

    // Change password
    changePassword() {
        if (this.passwordForm.invalid) {
            this.passwordForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);
        this.clearMessages();

        const data: IChangePasswordRequest = this.passwordForm.value;

        this.authService.changePassword(data).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.successMessage.set('Password changed successfully!');
                setTimeout(() => {
                    this.closePasswordModal();
                }, 1500);
            },
            error: (err) => {
                this.isLoading.set(false);
                this.errorMessage.set(err.error?.message || 'Failed to change password. Please check your current password.');
            }
        });
    }
}
