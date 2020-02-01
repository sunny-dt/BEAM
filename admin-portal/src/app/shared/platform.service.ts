import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Platform } from './platform.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.PLATFORM_ENDPOINT;

   }

  public totalPlatformsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required), 
    model_svg_filename : new FormControl(''),
    model_svg_url : new FormControl(''),
    facets_count : new FormControl(''),
    min_facetgroups_count : new FormControl('')
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      name : '',
      model_svg_filename : '',
      model_svg_url : '',
      facets_count : '',
      min_facetgroups_count : ''
    });
  }

  insertPlatform(platform)
  {
      return this.addNewPlatform(platform);
  }



  findPlatforms(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Platform[]>
  {
      return this.getPlatforms(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(platform)
  {
    this.form.setValue(platform);
  }


  /////////

  addNewPlatform(platform: any) {

    console.log("ApiService addNewPlatform");
    console.log("ApiService addNewPlatform platform: " + JSON.stringify(platform));

    const bodyParams = {
      'id': platform.id
        // 'name': platform.name,
        // 'model_svg_filename' : platform.model_svg_filename
    };

    console.log("ApiService addNewPlatform bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updatePlatform(platform: any)
{
  console.log("ApiService updatePlatform");
  console.log("ApiService updatePlatform platform: " + JSON.stringify(platform));

  const bodyParams = {
      'name': platform.name,
      'model_svg_filename' : platform.model_svg_filename
  };

  console.log("ApiService updatePlatform bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${platform.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deletePlatform(platform: any)
{
  console.log("ApiService deletePlatform");
  console.log("ApiService deletePlatform platform: " + JSON.stringify(platform));

  return this.httpClient.delete(`${this.serviceApiUrl}/${parseInt(platform.id)}`, { headers: Constants.HTTP_HEADERS });
}

getPlatforms(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<Platform[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
          console.log('getplatfoms', res);
            this.totalPlatformsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
