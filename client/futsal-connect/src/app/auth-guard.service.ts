import { Injectable } from '@angular/core';
import {
   Router,
   CanActivate,
   ActivatedRouteSnapshot,
   RouterStateSnapshot,
   ActivatedRoute
} from '@angular/router';

@Injectable()
export class AuthguardService implements CanActivate {

  constructor(private router: Router ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (localStorage.getItem('token')) {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }

}
