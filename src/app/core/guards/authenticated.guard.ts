import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isAuthenticated: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) { 
    router.navigate(['/login']);
    return false;
  }

  return true;
};