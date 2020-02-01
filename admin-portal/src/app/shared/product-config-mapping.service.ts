import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';

import { ProductConfigMapping } from './product-config-mapping.model';
import { Facet } from './facet.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigMappingService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PRODUCT_CONFIG_MAPPING_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.PRODUCT_CONFIG_MAPPING_ENDPOINT;

   }

  public productConfigId = 0;
  public totalMappingsCount = 0;
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

  insertProductConfigMapping(productconfigmapping)
  {
      return this.addNewProductConfigMapping(productconfigmapping);
  }



  findProductConfigMappings():  Observable<ProductConfigMapping[]>
  {
      return this.getProductConfigMappings();
  }





  populateForm(productconfigmapping)
  {
    this.form.setValue(productconfigmapping);
  }


  /////////

  addNewProductConfigMapping(facetsChambersGrouping: any) {

    console.log("ApiService addNewProductConfigMapping");
    console.log("ApiService addNewProductConfigMapping facetsChambersGrouping: " + JSON.stringify(facetsChambersGrouping));

    const bodyParams = facetsChambersGrouping


    console.log("ApiService addNewProductConfigMapping bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('productConfigId', this.productConfigId.toString())}
          );
}

updateProductConfigMapping(productconfigmapping: ProductConfigMapping)
{
  console.log("ApiService updateProductConfigMapping");
  console.log("ApiService updateProductConfigMapping productconfigmapping: " + JSON.stringify(productconfigmapping));

  const bodyParams = {
      'product_name': productconfigmapping.facet_group_name
  };

  console.log("ApiService updateProductConfigMapping bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${productconfigmapping.facet_group_id}`, bodyParams, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('productConfigId', this.productConfigId.toString())});
}

deleteProductConfigMapping(productconfigmapping: ProductConfigMapping)
{
  console.log("ApiService deleteProductConfigMapping");
  console.log("ApiService deleteProductConfigMapping product-config-mapping: " + JSON.stringify(productconfigmapping));

  return this.httpClient.delete(`${this.serviceApiUrl}/${productconfigmapping.facet_group_id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('productConfigId', this.productConfigId.toString())});
}

getProductConfigMappings():  Observable<ProductConfigMapping[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('productConfigId', this.productConfigId.toString())
           
    }).pipe(
        map(res =>  {
            
            let items = res["items"];
            this.totalMappingsCount = items.length;
            return items;
        })
    );
}

}
