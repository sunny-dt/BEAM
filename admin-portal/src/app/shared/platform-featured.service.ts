import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PlatformFeatured } from './platform-featured.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformFeaturedService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.FEATURED_ENDPOINT;

   }

  public totalPlatformFeaturedsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    ui_type : new FormControl('platform'),
    linked_element_type : new FormControl('', Validators.required),
    linked_element_id : new FormControl('', Validators.required),
    type_title : new FormControl('FEATURED', Validators.required),
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
      type_title : 'FEATURED',
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

  insertPlatformFeatured(platform_featured)
  {
      return this.addNewPlatformFeatured(platform_featured);
  }



  findPlatformFeatureds(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<PlatformFeatured[]>
  {
      return this.getPlatformFeatureds(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(platform_featured)
  {
    this.form.setValue(platform_featured);
  }


  /////////

  addNewPlatformFeatured(platform_featured: any) {

    console.log("ApiService addNewPlatformFeatured");
    console.log("ApiService addNewPlatformFeatured platform_featured: " + JSON.stringify(platform_featured));

    const bodyParams = {
        'ui_type': platform_featured.ui_type,
        'linked_element_type' : platform_featured.linked_element_type,
        'linked_element_id' : platform_featured.linked_element_id,
        'type_title' : platform_featured.type_title,
        'title' : platform_featured.title,
        'sub_title' : platform_featured.sub_title,
        'image_link' : platform_featured.image_link,
        'image_filename' : platform_featured.image_filename,
        'serial_order' : 1
    };



    console.log("ApiService addNewPlatformFeatured bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updatePlatformFeatured(platform_featured: any)
{
  console.log("ApiService updatePlatformFeatured");
  console.log("ApiService updatePlatformFeatured platform_featured: " + JSON.stringify(platform_featured));

  const bodyParams = {
    'ui_type': platform_featured.ui_type,
    'linked_element_type' : platform_featured.linked_element_type,
    'linked_element_id' : platform_featured.linked_element_id,
    'type_title' : platform_featured.type_title,
    'title' : platform_featured.title,
    'sub_title' : platform_featured.sub_title,
    'image_link' : platform_featured.image_link,
    'image_filename' : platform_featured.image_filename,
    'serial_order' : 1
  };

  console.log("ApiService updatePlatformFeatured bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${platform_featured.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deletePlatformFeatured(platform_featured: any)
{
  console.log("ApiService deletePlatformFeatured");
  console.log("ApiService deletePlatformFeatured platform_featured: " + JSON.stringify(platform_featured));

  return this.httpClient.delete(`${this.serviceApiUrl}/${platform_featured.id}`, { headers: Constants.HTTP_HEADERS });
}

getPlatformFeatureds(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<PlatformFeatured[]> {

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
            this.totalPlatformFeaturedsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
