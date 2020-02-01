import { AuthorizationService } from './../authServices/authorization.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import {mergeMap} from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    public token:string;
    constructor (private authService : AuthorizationService) {}
    
    intercept (request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        //  let accesstoken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg";
        //  let token = {accessToken : accesstoken};
        //  request = request.clone({
        //             setHeaders: {
        //                 Authorization: `Bearer ${token.accessToken}`
        //             }
        //         });
        //  return next.handle(request); 

        let userToken = localStorage.getItem("AdminUserToken");
        console.log('AuthInterceptor userToken: ', userToken);
        console.log('AuthInterceptor request: ', request);

        let accesstoken = "";

        if (request.url.includes("getUserRoles")) {
            
            accesstoken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg";
        } else {

            accesstoken = userToken;
        }
        
        let token = {accessToken : accesstoken};

        request = request.clone({

            setHeaders: {
                Authorization: `Bearer ${token.accessToken}`
            }
        });
        return next.handle(request); 
        
                /*
        return this.authService.tokenResponse()
        .pipe(mergeMap(token => {
            if (token) {

                // let accesstoken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IkczTWFwcGVyRGV2In0.eyJzY29wZSI6WyJvcGVuaWQiLCJlbWFpbCIsInByb2ZpbGUiXSwiY2xpZW50X2lkIjoiRzNNb2JpbGVfRGV2IiwiZmlyc3RuYW1lIjoiU2FqaXRoIiwiZW1wbG95ZWVJRCI6IlgwOTg1MDciLCJsYXN0bmFtZSI6IlJhbWEgVmFybWEiLCJleHAiOjE1NTM4MDE0NDl9.0TA3NJ6t-Cxi1VPtapldP5Y4SCOBLs8ayNEA83ykL7HSeUsIXfSMGkwxNq5fTsJSdCjW1-GNAM3GxRZHV5Vp-lqPCI50owWUCWE_cDA0DfhrMTEihIZ83djgQi0Mixvnni67l1GjlB3QHWryyGOORlz2ql6IIc_4BgBjgq-DQeanwNIF9Z9tjqBW8Z6NmTZWHaXU2G7HQHXu8ymUTbwwviWBrm2ax8P73M_vnBvOCezbkFok2y4hXZlrzDh_WiJY1A41ZAOQcjAgrVCeNoME7xEUwxmTWFnGw8ymDJ3Fxv4aI8wJoBN62-fiPyY-PPBoMXLeTcgKVsx7rvjqG4zYEg";
                //  let token = {accessToken : accesstoken};
                
                // clone and modify the request
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${token.accessToken}`
                    }
                });
            }
            return next.handle(request);    
        })
        );      */ 
}
}