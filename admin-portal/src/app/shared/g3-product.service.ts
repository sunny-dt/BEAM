import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { G3Product } from './g3-product.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class G3ProductService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.G3_PRODUCT_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.G3_PRODUCT_ENDPOINT;

   }

  public g2ProductTypeId = 0;
  public totalG3ProductsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    g2_product_type_id : new FormControl(null),
    name : new FormControl('', Validators.required),
    code : new FormControl('', [Validators.required, Validators.pattern(/^\d{4}$/)])
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      g2_product_type_id : null,
      name : '',
      code : ''
    });
  }

  insertG3Product(g3product)
  {
      return this.addNewG3Product(g3product);
  }



  findG3Products(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<G3Product[]>
  {
      return this.getG3Products(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(g3product)
  {
    this.form.setValue(g3product);
  }


  /////////

  addNewG3Product(g3product: any) {

    console.log("ApiService addNewG3Product");
    console.log("ApiService addNewG3Product g3product: " + JSON.stringify(g3product));

    const bodyParams = {
        'name': g3product.name,
        'code': g3product.code
    };

    console.log("ApiService addNewG3Product bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('g2ProductTypeId', this.g2ProductTypeId.toString())}
          );
}

updateG3Product(g3product: any)
{
  console.log("ApiService updateG3Product");
  console.log("ApiService updateG3Product g3product: " + JSON.stringify(g3product));

  const bodyParams = {
      'name': g3product.name,
      'code': g3product.code
  };

  console.log("ApiService updateG3Product bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${g3product.id}`, bodyParams, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('g2ProductTypeId', this.g2ProductTypeId.toString())});
}

deleteG3Product(g3product: any)
{
  console.log("ApiService deleteG3Product");
  console.log("ApiService deleteG3Product g3-product: " + JSON.stringify(g3product));

  return this.httpClient.delete(`${this.serviceApiUrl}/${g3product.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('g2ProductTypeId', this.g2ProductTypeId.toString())});
}

getG3Products(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<G3Product[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('g2ProductTypeId', this.g2ProductTypeId.toString())
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalG3ProductsCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
