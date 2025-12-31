# 🚗 CarNest - Car Rental Platform

A modern, full-featured car rental platform built with Angular 20. CarNest connects car vendors with customers, providing a seamless experience for browsing, listing, and renting vehicles.

![Angular](https://img.shields.io/badge/Angular-20.3.0-red?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### For Customers
- 🔍 **Browse Cars** - Explore available new and used cars with advanced filtering
- ❤️ **Favorites** - Save cars to your favorites list for quick access
- 📋 **Car Details** - View comprehensive car information including specs, images, and pricing
- 👤 **User Profile** - Manage your account information and preferences

### For Vendors
- 📝 **Car Management** - Add, edit, and delete car listings
- 📸 **Image Upload** - Upload multiple car images including license documentation
- 📊 **Listing Status** - Track approval status (pending, approved, rejected)

### For Admins
- 🛠️ **Dashboard** - Comprehensive admin panel for managing the platform
- ✅ **Car Approval** - Review and approve/reject car listings
- 🏷️ **Model Management** - Manage car brands and models

### General
- 🔐 **Authentication** - Secure JWT-based authentication system
- 🌓 **Dark/Light Mode** - Responsive theme support
- 📱 **Responsive Design** - Optimized for all device sizes

## 🏗️ Project Structure

```
src/
├── app/
│   ├── core/                    # Core services, guards, and interceptors
│   │   ├── guards/              # Route guards (auth, role-based)
│   │   ├── interceptors/        # HTTP interceptors
│   │   └── services/            # Singleton services
│   ├── features/                # Feature modules
│   │   ├── admin/               # Admin dashboard & management
│   │   ├── auth/                # Authentication (login, register)
│   │   ├── cars/                # Car listing, details, management
│   │   ├── favorites/           # User favorites
│   │   ├── home/                # Home page
│   │   └── profile/             # User profile
│   └── shared/                  # Shared components & utilities
│       ├── components/          # Reusable UI components
│       └── models/              # TypeScript interfaces
├── assets/                      # Static assets (images, icons)
└── styles.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v20.3.6)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/carnest-frontend.git
   cd carnest-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200/`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server |
| `npm run build` | Build for production |
| `npm run watch` | Build with watch mode |
| `npm test` | Run unit tests |

## 🔧 Configuration

### Environment Setup

The application connects to a backend API. Configure the API base URL in the environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

### TailwindCSS

The project uses TailwindCSS for styling. Configuration can be found in `tailwind.config.js`.

## 🧪 Testing

### Unit Tests
```bash
ng test
```

### E2E Tests
```bash
ng e2e
```

## 📦 Building for Production

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

## 🔗 API Documentation

A Postman collection is included in the repository: `CarNest_Postman_Collection.json`

Import this collection into Postman to explore and test the API endpoints.

## 🛠️ Tech Stack

- **Framework**: Angular 20
- **Language**: TypeScript 5.9
- **Styling**: TailwindCSS 3.4
- **HTTP Client**: Angular HttpClient with RxJS
- **Authentication**: JWT (jwt-decode)
- **Testing**: Karma + Jasmine
- **Code Quality**: Prettier

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Customer** | Browse cars, add to favorites, view details |
| **Vendor** | List cars for rent, manage listings |
| **Admin** | Full platform management, approve/reject listings |

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ as an ITI .NET Graduation Project**
