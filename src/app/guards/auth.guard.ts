import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // User is an admin, allow access
  } else {
    // Not an admin, redirect to login and block access
    router.navigate(['/login']);
    return false;
  }
};
