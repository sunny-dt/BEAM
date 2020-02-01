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
export class FabService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.MASTERS_ENDPOINT;

   }

  public totalCustomersCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public customerID = 0;

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required),
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      name : '',
    });
  }

  findFabs(customerId, filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<any>
  {
      return this.getMasterFabs(customerId, filter, sortOrder, sortColumn, page, pageSize);
  }

  getMasterFabs(customerId, filter = '', sortOrder = 'asc', sortColumn='id', page = 1, pageSize = 99999999):  Observable<any> {

    console.log("ApiService getCustomers: ", this.serviceApiUrl);
    console.log("ApiService customerId: ", customerId);
    // master/getMasterFabs?customerId=351&filter=13&page=1&pagesize=1&sortBy=id&sortOrder=desc

    return this.httpClient.get(`${this.serviceApiUrl}/getMasterFabs?`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('customerId', customerId)
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalCustomersCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
