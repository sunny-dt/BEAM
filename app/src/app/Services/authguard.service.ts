import { JwtHelperService } from '@auth0/angular-jwt';
import { mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthorizationService } from './../authorization.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRolesService } from '../UserRoles.service';

const jwtHelperService = new JwtHelperService()

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {



    public tokenResponse;
    
    constructor( public authorizationService: AuthorizationService, public router: Router, public userRolesService: UserRolesService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        // return true;

        if (localStorage.getItem("isUserLogin") == "true") {

            let userToken = localStorage.getItem("UserToken");
            console.log('AuthInterceptor userToken: ', userToken);

            if (userToken) {

                const decodedToken = jwtHelperService.decodeToken(userToken);
                console.log('decodedToken: ', decodedToken);

                localStorage.setItem("UserDetails", JSON.stringify(decodedToken.response));

                if(decodedToken.response.roles) {

                    console.log('decodedToken response roles: ', decodedToken.response.roles);
                    console.log('decodedToken userRolesService SuperAdmin: ', this.userRolesService.SuperAdmin);
                    // if (decodedToken.role == 'Analytics_User' || decodedToken.role == 'Mapper_User'
                    // || decodedToken.role == 'Explorer_User' || decodedToken.role == 'Builder_User'
                    // || decodedToken.role == 'admin'){
                    if (this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.MapperUser)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.ExplorerUser)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.AnalyticsUser)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.BuilderUser)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.SuperAdmin)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.MapperAdmin)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.ExplorerAdmin)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.AnalyticsAdmin)
                    || this.getModuleUserRole(decodedToken.response.roles, this.userRolesService.BuilderAdmin)) {

                        return true;
                    } else {

                        this.router.navigate(['unauthorized']);
                        return false;
                    }
                } else {

                    let dummy = [];
                    localStorage.setItem('UserDetails', JSON.stringify(dummy));
                    localStorage.setItem('UserToken', "");

                    this.router.navigate(['unauthorized']);
                    return false;
                }
            } else {
                
                let dummy = [];
                localStorage.setItem('UserDetails', JSON.stringify(dummy));
                localStorage.setItem('UserToken', "");
            
                this.router.navigate(['/login']);
                return false;
            }
        } else {
    
            let dummy = [];
            localStorage.setItem('UserDetails', JSON.stringify(dummy));
            localStorage.setItem('UserToken', "");
        
            this.router.navigate(['/login']);
            return false;
        }

        /*
        return this.authorizationService.tokenResponse().pipe(map(token => {

            return true;
            
            if (token) {

                // console.log('authenticated: ', token.accessToken);
                const decodedToken = jwtHelperService.decodeToken(token.accessToken);
                console.log('decodedToken: ', decodedToken,decodedToken);

                if(decodedToken.role) {

                    if (decodedToken.role == 'user' || decodedToken.role == 'admin'){

                        return true;
                    } else {

                        this.router.navigate(['unauthorized']);
                        return false;
                    }
                } else {

                    this.router.navigate(['unauthorized']);
                    return false;
                }
            } else {

                console.log('not-authenticated');
                this.authorizationService.authorize();
                return false;
            }
        }));
        */
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        throw new Error("Method not implemented.");
    }

    getModuleUserRole(userRoles, moduleUserRole) {
    
        let isModuleUserRole = false;
    
        for (let i = 0; i < userRoles.length; i++) {
    
          if (moduleUserRole == userRoles[i]) {
    
            isModuleUserRole = true;
          }
        }
    
        return isModuleUserRole;
    }
}