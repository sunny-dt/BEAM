import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemIDConfigService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.MASTERS_ENDPOINT;
  }

  private serviceApiUrl; 

  getMasterSystemIDConfig(customerID, fabID, projectNo):  Observable<any> {

    console.log("ApiService getCustomers: ", this.serviceApiUrl);
    console.log("ApiService fabID: ", fabID);

    return this.httpClient.get(`${this.serviceApiUrl}/getMasterSystemIdConfigurations?`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('projectNo', projectNo)
            .set('CustomerID', customerID)
            .set('FabID', fabID)
    }).pipe(
        map(res =>  {
            return res;
        })
    );
}

}
