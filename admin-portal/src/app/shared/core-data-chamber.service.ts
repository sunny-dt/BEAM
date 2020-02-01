import { Platform } from './platform.model';
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
export class CoreDataChamberService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    // this.serviceApiUrl = this.env.apiUrl + Constants.CHAMBER_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.BUILDERS_ENDPOINT;
    this.serviceApiUrlMaster = environment.apiUrl + Constants.MASTERS_ENDPOINT;

   }

  public totalChambersCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  public chamberFamilyID = 0;
  public platformID = 0;
  private serviceApiUrl; 
  private serviceApiUrlMaster; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required),
    gotCode : new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(6)]),
    node_type_id : new FormControl(null),
    node_type_name : new FormControl(null),
    isFeed : new FormControl(null),
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      name : '',
      gotCode : '',
      node_type_id : '',
      node_type_name : '',
      isFeed : '',
    });
  }

  insertChamber(chamber, platform_id, chamber_family_id)
  {
      return this.addNewChamber(chamber, platform_id, chamber_family_id);
  }



  findChambers(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Chamber[]>
  {
      return this.getChambers(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(chamber)
  {
    this.form.setValue(chamber);
  }


  /////////

  addNewChamber(chamber: any, platform_id, chamber_family_id) {

    console.log("ApiService addNewChamber");
    console.log("ApiService addNewChamber chamber: " + JSON.stringify(chamber));

    const bodyParams = {
        'name': chamber.name,
        'platform_id' : platform_id,
        'chamber_family_id' : chamber_family_id,
        'got_code' : chamber.gotCode
    };

    console.log("ApiService addNewChamber bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrlMaster+'/addNewMasterChamber', bodyParams, { headers: Constants.HTTP_HEADERS});
}

updateChamber(chamber: any, chamber_family_id)
{
  console.log("ApiService updateChamber");
  console.log("ApiService updateChamber chamber: " + JSON.stringify(chamber));

  const bodyParams = {
      'name': chamber.name,
      'chamber_family_id': chamber_family_id,
      'got_code' : chamber.gotCode
  };

  console.log("ApiService updateChamber bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrlMaster}/chamber/${chamber.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteChamber(chamber: any)
{
  console.log("ApiService deleteChamber");
  console.log("ApiService deleteChamber chamber: " + JSON.stringify(chamber));

  return this.httpClient.delete(`${this.serviceApiUrlMaster}/chamber/${chamber.id}`, { headers: Constants.HTTP_HEADERS });
}

getChambers(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<Chamber[]> {

    return this.httpClient.get(`${this.serviceApiUrl}/${this.chamberFamilyID}/children?`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
          console.log("ApiService getChambers res", res);
            // this.totalChambersCount = parseInt(res["totalCount"]); 
            let response = JSON.parse(JSON.stringify(res));
          this.totalChambersCount = response["items"].length; 
            return res["items"];
        })
    );
}


}

