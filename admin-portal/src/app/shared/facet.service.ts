import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Facet } from './facet.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FacetService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.FACET_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.FACET_ENDPOINT;

   }

  public platformId = 0;
  public totalFacetsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    platform_id : new FormControl(null),
    name : new FormControl('', [Validators.required, Validators.pattern(/^[0-9a-zA-Z]{1}$/)])
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      platform_id: this.platformId,
      name : ''
    });
  }

  insertFacet(facet)
  {
      return this.addNewFacet(facet);
  }



  findFacets(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Facet[]>
  {
      return this.getFacets(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(facet)
  {
    this.form.setValue(facet);
  }


  /////////

  addNewFacet(facet: any) {

    console.log("ApiService addNewFacet");
    console.log("ApiService addNewFacet facet: " + JSON.stringify(facet));

    const bodyParams = {
        'name': facet.name
    };

    console.log("ApiService addNewFacet bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('platformId', this.platformId.toString())}
          );
}

updateFacet(facet: any)
{
  console.log("ApiService updateFacet");
  console.log("ApiService updateFacet facet: " + JSON.stringify(facet));

  const bodyParams = {
      'name': facet.name
  };

  console.log("ApiService updateFacet bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${facet.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteFacet(facet: any)
{
  console.log("ApiService deleteFacet");
  console.log("ApiService deleteFacet facet: " + JSON.stringify(facet));

  return this.httpClient.delete(`${this.serviceApiUrl}/${facet.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('platformId', this.platformId.toString())});
}

getFacets(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<Facet[]> {

    return this.httpClient.get(this.serviceApiUrl, {
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
            this.totalFacetsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
