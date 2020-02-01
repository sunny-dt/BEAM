import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MenuNodeType } from './menu-node-type.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuNodeTypeService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.MENUNODE_TYPE_ENDPOINT;

   }

  public totalMenuNodeTypesCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required)
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      name : ''
    });
  }

  insertMenuNodeType(menu_node_type)
  {
      return this.addNewMenuNodeType(menu_node_type);
  }



  findMenuNodeTypes(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<MenuNodeType[]>
  {
      return this.getMenuNodeTypes(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(menu_node_type)
  {
    this.form.setValue(menu_node_type);
  }


  /////////

  addNewMenuNodeType(menu_node_type: any) {

    console.log("ApiService addNewMenuNodeType");
    console.log("ApiService addNewMenuNodeType menu_node_type: " + JSON.stringify(menu_node_type));

    const bodyParams = {
        'name': menu_node_type.name,
    };

    console.log("ApiService addNewMenuNodeType bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateMenuNodeType(menu_node_type: any)
{
  console.log("ApiService updateMenuNodeType");
  console.log("ApiService updateMenuNodeType menu_node_type: " + JSON.stringify(menu_node_type));

  const bodyParams = {
      'name': menu_node_type.name,
  };

  console.log("ApiService updateMenuNodeType bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${menu_node_type.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteMenuNodeType(menu_node_type: any)
{
  console.log("ApiService deleteMenuNodeType");
  console.log("ApiService deleteMenuNodeType menu_node_type: " + JSON.stringify(menu_node_type));

  return this.httpClient.delete(`${this.serviceApiUrl}/${menu_node_type.id}`, { headers: Constants.HTTP_HEADERS });
}

getMenuNodeTypes(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<MenuNodeType[]> {

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
            this.totalMenuNodeTypesCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
