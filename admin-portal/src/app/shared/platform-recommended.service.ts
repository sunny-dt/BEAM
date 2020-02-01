import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PlatformRecommended } from './platform-recommended.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformRecommendedService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.RECOMMENDED_ENDPOINT;

   }

  public totalPlatformRecommendedsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    ui_type : new FormControl('platform'),
    linked_element_type : new FormControl('', Validators.required),
    linked_element_id : new FormControl('', Validators.required),
    type_title : new FormControl('RECOMMENDED', Validators.required),
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
      type_title : 'RECOMMENDED',
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

  insertPlatformRecommended(platform_recommended)
  {
      return this.addNewPlatformRecommended(platform_recommended);
  }



  findPlatformRecommendeds(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<PlatformRecommended[]>
  {
      return this.getPlatformRecommendeds(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(platform_recommended)
  {
    this.form.setValue(platform_recommended);
  }


  /////////

  addNewPlatformRecommended(platform_recommended: any) {

    console.log("ApiService addNewPlatformRecommended");
    console.log("ApiService addNewPlatformRecommended platform_recommended: " + JSON.stringify(platform_recommended));

    const bodyParams = {
        'ui_type': platform_recommended.ui_type,
        'linked_element_type' : platform_recommended.linked_element_type,
        'linked_element_id' : platform_recommended.linked_element_id,
        'type_title' : platform_recommended.type_title,
        'title' : platform_recommended.title,
        'sub_title' : platform_recommended.sub_title,
        'image_link' : platform_recommended.image_link,
        'image_filename' : platform_recommended.image_filename,
        'serial_order' : 1
    };



    console.log("ApiService addNewPlatformRecommended bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updatePlatformRecommended(platform_recommended: any)
{
  console.log("ApiService updatePlatformRecommended");
  console.log("ApiService updatePlatformRecommended platform_recommended: " + JSON.stringify(platform_recommended));

  const bodyParams = {
    'ui_type': platform_recommended.ui_type,
    'linked_element_type' : platform_recommended.linked_element_type,
    'linked_element_id' : platform_recommended.linked_element_id,
    'type_title' : platform_recommended.type_title,
    'title' : platform_recommended.title,
    'sub_title' : platform_recommended.sub_title,
    'image_link' : platform_recommended.image_link,
    'image_filename' : platform_recommended.image_filename,
    'serial_order' : 1
  };

  console.log("ApiService updatePlatformRecommended bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${platform_recommended.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deletePlatformRecommended(platform_recommended: any)
{
  console.log("ApiService deletePlatformRecommended");
  console.log("ApiService deletePlatformRecommended platform_recommended: " + JSON.stringify(platform_recommended));

  return this.httpClient.delete(`${this.serviceApiUrl}/${platform_recommended.id}`, { headers: Constants.HTTP_HEADERS });
}

getPlatformRecommendeds(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<PlatformRecommended[]> {

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
            this.totalPlatformRecommendedsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
