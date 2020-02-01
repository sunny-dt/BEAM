import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Chamber } from './chamber.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvService } from '../env.service';
import { Constants } from './constants';
import {map} from "rxjs/operators";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.USER_ENDPOINT;
   }

  private serviceApiUrl; 

  getUserRoles(username, password):  Observable<any> {

    console.log("ApiService getUserRoles");
    console.log("ApiService getUserRoles username: " + JSON.stringify(username));
    console.log("ApiService getUserRoles password: " + JSON.stringify(password));
  
    const bodyParams = {
      'username': username,
      'password': password
    };
  
    console.log("ApiService getUserRoles bodyParams: " + JSON.stringify(bodyParams));
  
    return this.httpClient.post(`${this.serviceApiUrl}/getUserRoles`, bodyParams, { headers: Constants.HTTP_HEADERS });
  }
}
