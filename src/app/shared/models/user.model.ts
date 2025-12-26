export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    createdDate: string;
    role: 'Admin' | 'Vendor' | 'Customer';
    token: string;
    phoneNumber?: string;
}


export interface IRegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    password: string;
    confirmPassword?: string;
    phoneNumber?: string;
    role: 'Vendor' | 'Customer';
}

export interface ILoginRequest {
    email: string;
    password: string;
}

export interface IAuthResponse {
    token: string;
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    nationalId: string;
    address: string;
    phoneNumber: string;
    createdDate: string;
    role: string;
    expiresAt: string;
}

// Interface for profile update request (email and nationalId are required by backend but not editable by user)
export interface IUpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    nationalId: string;
    address: string;
    phoneNumber: string;
}

// Interface for password change request
export interface IChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

