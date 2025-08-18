import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { environment } from '../../environment/environment';
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor() { }

  canActivate(): boolean {
    if (!environment.canActivate) {
      console.warn('Guard is disabled in the environment configuration.');
      return false;
    }
    return true;
  }
}
