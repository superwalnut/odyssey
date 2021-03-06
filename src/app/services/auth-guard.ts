import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.getLoginAccount();
        console.log('acc', account);
        if(account && account.docId){
             // check if route is restricted by role
             if (route.data.roles) {
                const matches = route.data.roles.filter(value => account.role && account.role.includes(value));
                if(!matches || matches.length <= 0){
                    // role not authorised so redirect to home page
                    this.router.navigate(['/']);
                    return false;
                }
            }

            // authorised so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}