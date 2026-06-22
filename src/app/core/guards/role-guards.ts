import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {

    const userStr = localStorage.getItem('user');
    if (!userStr) return this.router.parseUrl('/login');

    const user = JSON.parse(userStr);
    const allowedRoles: string[] = route.data['roles'];

    if (!allowedRoles.includes(user.txRole)) {

      return this.router.parseUrl('/nao-autorizado');
    }

    return true;
  }
}
