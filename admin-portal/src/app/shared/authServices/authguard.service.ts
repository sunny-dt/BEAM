import { AuthorizationService } from './authorization.service';
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { mergeMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwtHelperService = new JwtHelperService();

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    public tokenResponse;

    
    constructor( public authorizationService: AuthorizationService, public router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|boolean{

        // let isUesrLogin = window.localStorage.getItem("isUserLogin");
        // console.log('authorizationService isUesrLogin ', isUesrLogin);
        
        // if (window.localStorage.getItem("isUserLogin") == "true") {

        //     return true;
        // } else {

        //     this.router.navigate(['/login']);
        //     return false;
            
        // }

        if (localStorage.getItem("isAdminUserLogin") == "true") {

            let userToken = localStorage.getItem("AdminUserToken");
            console.log('AuthInterceptor userToken: ', userToken);

            if (userToken) {

                const decodedToken = jwtHelperService.decodeToken(userToken);
                console.log('decodedToken: ', decodedToken);

                localStorage.setItem("AdminUserDetails", JSON.stringify(decodedToken.response));

                if(decodedToken.response.roles) {

                    console.log('decodedToken response roles: ', decodedToken.response.roles);
                    // if (decodedToken.role == 'Analytics_User' || decodedToken.role == 'Mapper_User'
                    // || decodedToken.role == 'Explorer_User' || decodedToken.role == 'Builder_User'
                    // || decodedToken.role == 'admin'){
                    if (this.getModuleUserRole(decodedToken.response.roles, "Super_Admin")) {

                        return true;
                    } else {

                        this.router.navigate(['unauthorized']);
                        return false;
                    }
                } else {

                    let dummy = [];
                    localStorage.setItem('AdminUserDetails', JSON.stringify(dummy));
                    localStorage.setItem('AdminUserToken', "");

                    this.router.navigate(['unauthorized']);
                    return false;
                }
            } else {
                
                let dummy = [];
                localStorage.setItem('AdminUserDetails', JSON.stringify(dummy));
                localStorage.setItem('AdminUserToken', "");
            
                this.router.navigate(['/login']);
                return false;
            }
        } else {
    
            let dummy = [];
            localStorage.setItem('AdminUserDetails', JSON.stringify(dummy));
            localStorage.setItem('AdminUserToken', "");
        
            this.router.navigate(['/login']);
            return false;
        }

        // return this.authorizationService.tokenResponse().pipe(map(token => {

        //     return true;
        //     //  var token = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg";
          
        //     if (token) {

        //         // console.log('authenticated: ', token.accessToken);
        //         // const decodedToken =  this.jwtHelperService.decodeToken(token.accessToken);
        //        const decodedToken =  jwtHelperService.decodeToken(token.accessToken);

        //         if(decodedToken.role) {

        //             if (decodedToken.role == 'admin'){

        //                 return true;
        //             } else {

        //                 this.router.navigate(['unauthorized']);
        //                 return false;
                        
        //             }
        //         } else {

        //             this.router.navigate(['unauthorized']);
        //             return false;
                    
        //         }
               
        //     } else {

        //         console.log('not authenticated');
        //         this.authorizationService.authorize();
        //         return false;
        //     }
        // }));
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

