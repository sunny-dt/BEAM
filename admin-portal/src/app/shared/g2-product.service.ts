import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { G2Product } from './g2-product.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class G2ProductService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.G2_PRODUCT_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.G2_PRODUCT_ENDPOINT;

   }

  public platformId = 0;
  public totalG2ProductsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    platform_id : new FormControl(null),
    name : new FormControl('', Validators.required),
    rnd_product_name : new FormControl('', Validators.required),
    rnd_product_code : new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)])
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      platform_id : this.platformId,
      name : '',
      rnd_product_name : '',
      rnd_product_code : ''
    });
  }

  insertG2Product(g2product)
  {
      return this.addNewG2Product(g2product);
  }



  findG2Products(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<G2Product[]>
  {
      return this.getG2Products(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(g2product)
  {
    this.form.setValue(g2product);
  }


  /////////

  addNewG2Product(g2product: any) {

    console.log("ApiService addNewG2Product");
    console.log("ApiService addNewG2Product g2product: " + JSON.stringify(g2product));

    const bodyParams = {
        'name': g2product.name,
        'rnd_product_name' : g2product.rnd_product_name,
        'rnd_product_code' : g2product.rnd_product_code
    };

    console.log("ApiService addNewG2Product bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('platformId', this.platformId.toString())}
          );
}

updateG2Product(g2product: any)
{
  console.log("ApiService updateG2Product");
  console.log("ApiService updateG2Product g2product: " + JSON.stringify(g2product));

  const bodyParams = {
      'name': g2product.name,
      'rnd_product_name' : g2product.rnd_product_name,
      'rnd_product_code' : g2product.rnd_product_code
  };

  console.log("ApiService updateG2Product bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${g2product.id}`, bodyParams, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('platformId', this.platformId.toString())});
}

deleteG2Product(g2product: any)
{
  console.log("ApiService deleteG2Product");
  console.log("ApiService deleteG2Product g2-product: " + JSON.stringify(g2product));

  return this.httpClient.delete(`${this.serviceApiUrl}/${g2product.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('platformId', this.platformId.toString())});
}

getG2Products(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<G2Product[]> {

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
            this.totalG2ProductsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
