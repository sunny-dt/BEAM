import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PlatformLatest } from './platform-latest.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformLatestService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.LATEST_ENDPOINT;

   }

  public totalPlatformLatestsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    ui_type : new FormControl('platform'),
    linked_element_type : new FormControl('', Validators.required),
    linked_element_id : new FormControl('', Validators.required),
    type_title : new FormControl('LATEST', Validators.required),
    title : new FormControl('', Validators.required),
    sub_title : new FormControl('', Validators.required),
    image_link : new FormControl(''),
    image_filename : new FormControl(''),
    created_by_id : new FormControl(null),
    created_by_name : new FormControl(null),
    modified_by_id : new FormControl(null),
    modified_by_name : new FormControl(null),
    serial_order : new FormControl(1),
    c_date : new FormControl(null),
    m_date : new FormControl(null)

  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      ui_type : 'platform',
      linked_element_type : '',
      linked_element_id : '',
      type_title : 'LATEST',
      title : '',
      sub_title : '',
      image_link : '',
      image_filename : '',
      created_by_id : '',
      created_by_name : '',
      modified_by_id : '',
      modified_by_name : '',
      serial_order : 1,
      c_date : '',
      m_date : ''
    });
  }

  insertPlatformLatest(platform_latest)
  {
      return this.addNewPlatformLatest(platform_latest);
  }



  findPlatformLatests(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<PlatformLatest[]>
  {
      return this.getPlatformLatests(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(platform_latest)
  {
    this.form.setValue(platform_latest);
  }


  /////////

  addNewPlatformLatest(platform_latest: any) {

    console.log("ApiService addNewPlatformLatest");
    console.log("ApiService addNewPlatformLatest platform_latest: " + JSON.stringify(platform_latest));

    const bodyParams = {
        'ui_type': platform_latest.ui_type,
        'linked_element_type' : platform_latest.linked_element_type,
        'linked_element_id' : platform_latest.linked_element_id,
        'type_title' : platform_latest.type_title,
        'title' : platform_latest.title,
        'sub_title' : platform_latest.sub_title,
        'image_link' : platform_latest.image_link,
        'image_filename' : platform_latest.image_filename,
        'serial_order' : 1
    };



    console.log("ApiService addNewPlatformLatest bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updatePlatformLatest(platform_latest: any)
{
  console.log("ApiService updatePlatformLatest");
  console.log("ApiService updatePlatformLatest platform_latest: " + JSON.stringify(platform_latest));

  const bodyParams = {
    'ui_type': platform_latest.ui_type,
    'linked_element_type' : platform_latest.linked_element_type,
    'linked_element_id' : platform_latest.linked_element_id,
    'type_title' : platform_latest.type_title,
    'title' : platform_latest.title,
    'sub_title' : platform_latest.sub_title,
    'image_link' : platform_latest.image_link,
    'image_filename' : platform_latest.image_filename,
    'serial_order' : 1
  };

  console.log("ApiService updatePlatformLatest bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${platform_latest.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deletePlatformLatest(platform_latest: any)
{
  console.log("ApiService deletePlatformLatest");
  console.log("ApiService deletePlatformLatest platform_latest: " + JSON.stringify(platform_latest));

  return this.httpClient.delete(`${this.serviceApiUrl}/${platform_latest.id}`, { headers: Constants.HTTP_HEADERS });
}

getPlatformLatests(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<PlatformLatest[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('ui_type', 'platform')
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalPlatformLatestsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
