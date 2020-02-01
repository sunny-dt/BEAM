import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';

import { MenunodeRecommended } from './menu-node-recommended.model';
import { environment } from '../../environments/environment';
import { MenuNodeService } from './menu-node.service';
import { MenuNode } from './menu-node.model';

@Injectable({
  providedIn: 'root'
})
export class MenunodeRecommendedService {

  constructor(private httpClient: HttpClient, 
    private env : EnvService,
    private menuNodeService : MenuNodeService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.PRODUCT_CONFIG_MAPPING_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.RECOMMENDED_ENDPOINT;
    this.menuNodeServiceApiUrl = environment.apiUrl + Constants.MENUNODE_ENDPOINT;

   }

  public productConfigId = 0;
  public totalMenunodeRecommendedsCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 
  private menuNodeServiceApiUrl;
  

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    menu_node_id : new FormControl(null),
    menu_node_name : new FormControl('')
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      menu_node_id : null,
      menu_node_name : ''
    });
  }

  updateMenunodeRecommendedMappings(menunodeRecommendedMapping)
  {
      return this.updateMenunodeRecommendedLinkings(menunodeRecommendedMapping);
  }



  findMenunodeRecommendeds():  Observable<MenunodeRecommended[]>
  {
      return this.getMenunodeRecommendeds();
  }

  findMenunodeDescendentDataNodes():  Observable<MenuNode[]>
  {
      return this.getMenunodesDescendentDataNodes();
  }





  // populateForm(menunodeRecommended)
  // {
  //   this.form.setValue(menunodeRecommended);
  // }


  /////////

  updateMenunodeRecommendedLinkings(menunodeRecommendedMapping: any) {

    console.log("ApiService addNewMenunodeRecommended");
    console.log("ApiService addNewMenunodeRecommended menunodeRecommendedMapping: " + JSON.stringify(menunodeRecommendedMapping));

    const bodyParams = menunodeRecommendedMapping


    console.log("ApiService addNewMenunodeRecommended bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(`${this.menuNodeServiceApiUrl}/${this.menuNodeService.currentSelectedNodeId}/recommended`, bodyParams, { headers: Constants.HTTP_HEADERS });
}



getMenunodeRecommendeds():  Observable<MenunodeRecommended[]> {


    return this.httpClient.get(`${this.menuNodeServiceApiUrl}/${this.menuNodeService.currentSelectedNodeId}/recommended`, {
        headers: Constants.HTTP_HEADERS
           
    }).pipe(
        map(res =>  {
            
            let items = res["items"];
            this.totalMenunodeRecommendedsCount = items.length;
            return items;
        })
    );
}

getMenunodesDescendentDataNodes():  Observable<MenuNode[]> {

  return this.httpClient.get(`${this.menuNodeServiceApiUrl}/${this.menuNodeService.currentSelectedNodeId}/descendent_data_nodes`, {
      headers: Constants.HTTP_HEADERS
         
  }).pipe(
      map(res =>  {
          let items = res as MenuNode[];
          return items;
      })
  );
}


}
