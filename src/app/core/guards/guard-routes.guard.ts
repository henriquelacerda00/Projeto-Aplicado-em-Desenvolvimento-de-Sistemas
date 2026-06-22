import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const isLoggedIn: CanActivateFn = async (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const inviteToken = route.queryParamMap.get('token') || route.queryParamMap.get('invite');

  if (inviteToken) {
    return true;
  }

  const loggedIn = await authService.isLoggedIn();

  if (loggedIn) {
    return router.createUrlTree(['/home']);
  }

  return true;
};
