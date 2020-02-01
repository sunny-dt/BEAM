import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ProductConfig } from './product-config.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { Facet } from './facet.model';
import { Chamber } from './chamber.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PRODUCT_CONFIG_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.PRODUCT_CONFIG_ENDPOINT;

   }

  public g3productId = 0;
  public totalProductConfigsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    product_id : new FormControl(null),
    product_name : new FormControl('', Validators.required)
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      product_id : null,
      product_name : ''
    });
  }

  insertProductConfig(productconfig)
  {
      return this.addNewProductConfig(productconfig);
  }



  findProductConfigs(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<ProductConfig[]>
  {
      return this.getProductConfigs(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(productconfig)
  {
    this.form.setValue(productconfig);
  }


  /////////

  addNewProductConfig(productconfig: any) {

    console.log("ApiService addNewProductConfig");
    console.log("ApiService addNewProductConfig productconfig: " + JSON.stringify(productconfig));

    const bodyParams = {
        'product_name': productconfig.product_name
    };


    console.log("ApiService addNewProductConfig bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('g3productId', this.g3productId.toString())}
          );
}

updateProductConfig(productconfig: any)
{
  console.log("ApiService updateProductConfig");
  console.log("ApiService updateProductConfig productconfig: " + JSON.stringify(productconfig));

  const bodyParams = {
      'product_name': productconfig.product_name
  };

  console.log("ApiService updateProductConfig bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${productconfig.id}`, bodyParams, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('g3productId', this.g3productId.toString())});
}

deleteProductConfig(productconfig: any)
{
  console.log("ApiService deleteProductConfig");
  console.log("ApiService deleteProductConfig product-config: " + JSON.stringify(productconfig));

  return this.httpClient.delete(`${this.serviceApiUrl}/${productconfig.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('g3productId', this.g3productId.toString())});
}

getFacetsByProductConfigId(productConfigId: number):  Observable<Facet[]>
{
  console.log("ApiService getFacetsByProductConfigId");
  console.log("ApiService getFacetsByProductConfigId productConfigId: " + JSON.stringify(productConfigId));

  return this.httpClient.get(`${this.serviceApiUrl}/${productConfigId}/facets`, 
  { headers: Constants.HTTP_HEADERS })
  .pipe(
    map(res =>  {

        return res["items"];
    })
    );
}

getChambersByProductConfigId(productConfigId: number):  Observable<Chamber[]>
{
  console.log("ApiService getFacetsByProductConfigId");
  console.log("ApiService getFacetsByProductConfigId productConfigId: " + JSON.stringify(productConfigId));

  return this.httpClient.get(`${this.serviceApiUrl}/${productConfigId}/chambers`, 
  { headers: Constants.HTTP_HEADERS })
  .pipe(
    map(res =>  {

        return res["items"];
    })
    );
}


getProductConfigs(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<ProductConfig[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('g3productId', this.g3productId.toString())
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            
            this.totalProductConfigsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
