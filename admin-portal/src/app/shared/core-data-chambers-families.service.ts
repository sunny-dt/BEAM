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
export class CoreDataChamberFamiliesService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //  this.serviceApiUrl2 = this.env.apiUrl + Constants.BUILDERS_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.MASTERS_ENDPOINT;
    this.serviceApiUrl2 = environment.apiUrl + Constants.BUILDERS_ENDPOINT;

   }

  public totalChamberFamiliesCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  public platformId = 0;
  private serviceApiUrl; 
  private serviceApiUrl2;

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    platform_id : new FormControl(null),
    name : new FormControl('', Validators.required),
    node_type_name : new FormControl(null),
    node_type_id : new FormControl(null),
    isFeed : new FormControl(null),
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      platform_id: this.platformId,
      name : '',
      node_type_name : '',
      node_type_id : '',
      isFeed : '',
    });
  }

  insertChamber(chamber)
  {
      return this.addNewChamber(chamber);
  }

  findChamberFamilies(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Chamber[]>
  {
      return this.getChamberFamilies(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(chamber)
  {
    this.form.setValue(chamber);
  }


  /////////

  addNewChamber(chamber: any) {

    console.log("ApiService addNewChamber");
    console.log("ApiService addNewChamber chamber: " + JSON.stringify(chamber));

    const bodyParams = {
        'name': chamber.name,
        "platform_id": this.platformId
        // 'got_code' : chamber.got_code
    };

    console.log("ApiService addNewChamber bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl + '/addNewMasterChamberFamily', bodyParams, { headers: Constants.HTTP_HEADERS ,
       });
}

updateChamber(chamber: any)
{
  console.log("ApiService updateChamber");
  console.log("ApiService updateChamber chamber: " + JSON.stringify(chamber));

  const bodyParams = {
      "id" :parseInt(chamber.id),
      'name': chamber.name,
      "platform_id" : parseInt(chamber.platform_id),
      "got_code": ""
  };

  console.log("ApiService updateChamber bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.post(this.serviceApiUrl + '/updateMasterChamberFamilies', bodyParams, { headers: Constants.HTTP_HEADERS ,
     });
}

deleteChamber(chamber: any)
{
  console.log("ApiService deleteChamber");
  console.log("ApiService deleteChamber chamber: " + JSON.stringify(chamber));

  return this.httpClient.delete(`${this.serviceApiUrl +'/chamberFamily' }/${chamber.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('platformId', this.platformId.toString())});
}

getChamberFamilies(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<any[]> {

      return this.httpClient.get(`${this.serviceApiUrl2}/getBuilderChamberFamiliesForPlatform?`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('platformId', this.platformId.toString())
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
          let response = JSON.parse(JSON.stringify(res));
          this.totalChamberFamiliesCount = response.length; 
          return res["items"];
        })
    );
}


}
