import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HomeLatest } from './home-latest.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeLatestService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.LATEST_ENDPOINT;

   }

  public totalHomeLatestsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    ui_type : new FormControl('home'),
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
      ui_type : 'home',
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

  insertHomeLatest(home_latest)
  {
      return this.addNewHomeLatest(home_latest);
  }



  findHomeLatests(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<HomeLatest[]>
  {
      return this.getHomeLatests(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(home_latest)
  {
    this.form.setValue(home_latest);
  }


  /////////

  addNewHomeLatest(home_latest: any) {

    console.log("ApiService addNewHomeLatest");
    console.log("ApiService addNewHomeLatest home_latest: " + JSON.stringify(home_latest));

    const bodyParams = {
        'ui_type': home_latest.ui_type,
        'linked_element_type' : home_latest.linked_element_type,
        'linked_element_id' : home_latest.linked_element_id,
        'type_title' : home_latest.type_title,
        'title' : home_latest.title,
        'sub_title' : home_latest.sub_title,
        'image_link' : home_latest.image_link,
        'image_filename' : home_latest.image_filename,
        'serial_order' : 1
    };



    console.log("ApiService addNewHomeLatest bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateHomeLatest(home_latest: any)
{
  console.log("ApiService updateHomeLatest");
  console.log("ApiService updateHomeLatest home_latest: " + JSON.stringify(home_latest));

  const bodyParams = {
    'ui_type': home_latest.ui_type,
    'linked_element_type' : home_latest.linked_element_type,
    'linked_element_id' : home_latest.linked_element_id,
    'type_title' : home_latest.type_title,
    'title' : home_latest.title,
    'sub_title' : home_latest.sub_title,
    'image_link' : home_latest.image_link,
    'image_filename' : home_latest.image_filename,
    'serial_order' : 1
  };

  console.log("ApiService updateHomeLatest bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${home_latest.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteHomeLatest(home_latest: any)
{
  console.log("ApiService deleteHomeLatest");
  console.log("ApiService deleteHomeLatest home_latest: " + JSON.stringify(home_latest));

  return this.httpClient.delete(`${this.serviceApiUrl}/${home_latest.id}`, { headers: Constants.HTTP_HEADERS });
}

getHomeLatests(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<HomeLatest[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('ui_type', 'home')
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalHomeLatestsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
