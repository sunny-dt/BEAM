import { Injectable } from '@angular/core';
import { User } from './user.model';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.GET_LOGON_WINDOWS_USER_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.GET_LOGON_WINDOWS_USER_ENDPOINT;

  }

  private serviceApiUrl; 
   public user : User = null;
  
loadCurrentUserInfo():  Observable<User>
 {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS
    }).pipe(
        map(res =>  {
            this.user = res as User;
            return this.user;
        })
    );
}

}
