import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  // const token = authService.token;

  const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzVlY2Q1ZC1iMmIyLTQxYWMtYmFjNy0yNGY0Mjg3YjdjZjgiLCJlbWFpbCI6ImFkbWluQGNhcm5lc3QuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJqdGkiOiIwNDNiMDk4Ny1kYjIyLTQ5NDEtOTc5Zi03YjQ4MWY5ZjkwYzYiLCJleHAiOjE3NjUzODA3NjIsImlzcyI6IkNhck5lc3RBUEkiLCJhdWQiOiJDYXJOZXN0Q2xpZW50In0.KGAXweVaWhs5Lep8QbtqkUuht0o4PoMKwr0D4-XbcfI';

  const token = tempToken;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
