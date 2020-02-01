import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { NodeTypeAttributeName } from './node-type-attribute-name.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NodeTypeAttributeNameService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.NODE_TYPE_ATTRIBUTE_NAME_ENDPOINT;

   }

  public nodeTypeId = 0;
  public totalNodeTypeAttributeNamesCount = 0;
  public defaultPageSize = 200;
  private serviceApiUrl; 

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    // node_type_id : new FormControl(null, Validators.required),//Commented by Naveen Ellanki
    node_type_id : new FormControl(null),//Added by Naveen Ellanki: node_type_id should not be validated since it is hidden(primary key)
    attr_type_id : new FormControl(null, Validators.required),
    name : new FormControl('', [Validators.required])
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      node_type_id: this.nodeTypeId,
      attr_type_id : null,
      name : ''
    });
  }

  insertNodeTypeAttributeName(nodeTypeAttributeName)
  {
      return this.addNewNodeTypeAttributeName(nodeTypeAttributeName);
  }



  findNodeTypeAttributeNames(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<NodeTypeAttributeName[]>
  {
      return this.getNodeTypeAttributeNames(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(nodeTypeAttributeName)
  {

    const {id, node_type_id, attr_type_id, name } = nodeTypeAttributeName;
    const attrName = {id : id, name : name, node_type_id : node_type_id, attr_type_id : attr_type_id};

    this.form.setValue(attrName);
  }


  /////////

  addNewNodeTypeAttributeName(nodeTypeAttributeName: any) {

    console.log("ApiService addNewNodeTypeAttributeName");
    console.log("ApiService addNewNodeTypeAttributeName nodeTypeAttributeName: " + JSON.stringify(nodeTypeAttributeName));

    const bodyParams = {
        'name': nodeTypeAttributeName.name,
        'attr_type_id' : nodeTypeAttributeName.attr_type_id
    };

    console.log("ApiService addNewNodeTypeAttributeName bodyParams: " + JSON.stringify(bodyParams));
    console.log("service url ", this.serviceApiUrl);
    return this.httpClient.post(this.serviceApiUrl, bodyParams, { headers: Constants.HTTP_HEADERS ,
      params: new HttpParams()
          .set('nodeTypeId', this.nodeTypeId.toString())}
          );
}

updateNodeTypeAttributeName(nodeTypeAttributeName: any)
{
  console.log("ApiService updateNodeTypeAttributeName");
  console.log("ApiService updateNodeTypeAttributeName nodeTypeAttributeName: " + JSON.stringify(nodeTypeAttributeName));

  const bodyParams = {
      'name': nodeTypeAttributeName.name,
      'attr_type_id' : nodeTypeAttributeName.attr_type_id
  };

  console.log("ApiService updateNodeTypeAttributeName bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${nodeTypeAttributeName.id}`, bodyParams, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('nodeTypeId', this.nodeTypeId.toString())});
}

reorderAttributeName(nodeTypeAttributeNameId: number, newPosition : number)
{
  console.log("ApiService reorderAttributeName");
  console.log("ApiService reorderAttributeName nodeTypeAttributeName: " + JSON.stringify(nodeTypeAttributeNameId));
  console.log("ApiService reorderAttributeName position: " + newPosition);


  return this.httpClient.put(`${this.serviceApiUrl}/${nodeTypeAttributeNameId}/reorder/${newPosition}`, {}, { headers: Constants.HTTP_HEADERS });
}




deleteNodeTypeAttributeName(nodeTypeAttributeName: any)
{
  console.log("ApiService deleteNodeTypeAttributeName");
  console.log("ApiService deleteNodeTypeAttributeName nodeTypeAttributeName: " + JSON.stringify(nodeTypeAttributeName));

  return this.httpClient.delete(`${this.serviceApiUrl}/${nodeTypeAttributeName.id}`, { headers: Constants.HTTP_HEADERS ,
    params: new HttpParams()
        .set('nodeTypeId', this.nodeTypeId.toString())});
}

getNodeTypeAttributeNames(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<NodeTypeAttributeName[]> {


    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('nodeTypeId', this.nodeTypeId.toString())
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalNodeTypeAttributeNamesCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

getNodeTypeAttributeNamesByNodeTypeId(nodetypeid = 0 , filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<NodeTypeAttributeName[]> {


    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('nodeTypeId', nodetypeid.toString())
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalNodeTypeAttributeNamesCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
