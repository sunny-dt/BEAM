import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HomeFeatured } from './home-featured.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeFeaturedService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.FEATURED_ENDPOINT;

   }

  public totalHomeFeaturedsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    ui_type : new FormControl('home'),
    // linked_element_type : new FormControl('product', Validators.required),
    // linked_element_id : new FormControl('1', Validators.required),
    // type_title : new FormControl('FEATURED', Validators.required),
    linked_element_type : new FormControl('product'),
    linked_element_id : new FormControl('1'),
    type_title : new FormControl('FEATURED'),
    title : new FormControl('', Validators.required),//input
    sub_title : new FormControl('', Validators.required),//input
    tile_fg_color : new FormControl('#ffffff', Validators.required),//input
    tile_bg_color : new FormControl('#4599c3', Validators.required),//input
    image_link : new FormControl('', Validators.required),
    image_filename : new FormControl('', Validators.required),
    created_by_id : new FormControl(null),
    created_by_name : new FormControl(null),
    modified_by_id : new FormControl(null),
    modified_by_name : new FormControl(null),
    serial_order : new FormControl(1),
    c_date : new FormControl(null),
    m_date : new FormControl(null),
    url : new FormControl('', Validators.required),//input

  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      ui_type : 'home',
      linked_element_type : '',
      linked_element_id : '',
      type_title : 'FEATURED',
      title : '',
      sub_title : '',
      tile_fg_color : '#ffffff',
      tile_bg_color : '#4599c3',
      image_link : '',
      image_filename : '',
      created_by_id : '',
      created_by_name : '',
      modified_by_id : '',
      modified_by_name : '',
      serial_order : 1,
      c_date : '',
      m_date : '',
      url : ''
    });
  }

  insertHomeFeatured(home_featured)
  {
      return this.addNewHomeFeatured(home_featured);
  }



  findHomeFeatureds(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<HomeFeatured[]>
  {
      return this.getHomeFeatureds(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(home_featured)
  {
    this.form.setValue(home_featured);
  }


  /////////

  addNewHomeFeatured(home_featured: any) {

    console.log("ApiService addNewHomeFeatured");
    console.log("ApiService addNewHomeFeatured home_featured: " + JSON.stringify(home_featured));

    const bodyParams = {
        'ui_type': home_featured.ui_type,
        'linked_element_type' : home_featured.linked_element_type,
        'linked_element_id' : home_featured.linked_element_id,
        'type_title' : home_featured.type_title,
        'title' : home_featured.title,
        'sub_title' : home_featured.sub_title,
        'tile_fg_color' : home_featured.tile_fg_color,
        'tile_bg_color' : home_featured.tile_bg_color,
        'image_link' : home_featured.image_link,
        'image_filename' : home_featured.image_filename,
        'serial_order' : 1,
        'url' : home_featured.url
    };



    console.log("ApiService addNewHomeFeatured bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateHomeFeatured(home_featured: any)
{
  console.log("ApiService updateHomeFeatured");
  console.log("ApiService updateHomeFeatured home_featured: " + JSON.stringify(home_featured));

  const bodyParams = {
    'ui_type': home_featured.ui_type,
    'linked_element_type' : home_featured.linked_element_type,
    'linked_element_id' : home_featured.linked_element_id,
    'type_title' : home_featured.type_title,
    'title' : home_featured.title,
    'sub_title' : home_featured.sub_title,
    'tile_fg_color' : home_featured.tile_fg_color,
    'tile_bg_color' : home_featured.tile_bg_color,
    'image_link' : home_featured.image_link,
    'image_filename' : home_featured.image_filename,
    'serial_order' : 1,
    'url' : home_featured.url
  };

  console.log("ApiService updateHomeFeatured bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${home_featured.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteHomeFeatured(home_featured: any)
{
  console.log("ApiService deleteHomeFeatured");
  console.log("ApiService deleteHomeFeatured home_featured: " + JSON.stringify(home_featured));

  return this.httpClient.delete(`${this.serviceApiUrl}/${home_featured.id}`, { headers: Constants.HTTP_HEADERS });
}

getHomeFeatureds(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<HomeFeatured[]> {

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
            this.totalHomeFeaturedsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
