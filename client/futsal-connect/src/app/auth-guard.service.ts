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

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // If the user is login block acces login and register page else block acces profile page
    if (localStorage.getItem('token')) {
      return state.url.startsWith('/profile')
      ? true
      : (this.router.navigate(['/']), false);
    } else {
      return state.url.startsWith('/profile')
      ? (this.router.navigate(['/']), false)
      : true;
    }
  }

}
