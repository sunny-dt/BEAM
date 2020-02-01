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
export class BuilderPlatformService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PLATFORM_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.BUILDERS_ENDPOINT;

   }

  public totalPlatformsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required),
    model_svg_filename : new FormControl('', Validators.required),
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

  findPlatforms(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Platform[]>
  {
      return this.getPlatforms(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(platform)
  {
    this.form.setValue(platform);
  }

  getPlatforms(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<any> {

    return this.httpClient.get(`${this.serviceApiUrl}/getBuilderPlatforms?`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {

          let totalPlatformsCount = JSON.parse(JSON.stringify(res)); 
          this.totalPlatformsCount = totalPlatformsCount.length;
          return res;
        })
    );
  }

}
