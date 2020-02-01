import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MenuNode } from './menu-node.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvService } from '../env.service';
import { Constants } from './constants';
import {map} from "rxjs/operators";
import { environment } from '../../environments/environment';
import { ElementSchemaRegistry } from '@angular/compiler';
import { MessageService } from './global-message.service';


function findByIdInList(list, id) {
    let node;
    list.some(function(currentItem) {
      return node = currentItem.id == id ? currentItem : findByIdInList(currentItem.children, id);
    });
    return node;
  }


@Injectable({
  providedIn: 'root'
})
export class MenuNodeService {

  constructor(private httpClient: HttpClient, 
    private env : EnvService,    
    private messageService : MessageService
    ) {

    this.serviceApiUrl = environment.apiUrl + Constants.MENUNODE_ENDPOINT;

   }

  public totalChildMenuNodesCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 
  
  public currentSelectedNode : MenuNode = null;
  public currentSelectedNodeId : number = 0;

  public currentMenuNodeTree = null;



  public tree_data: MenuNode[] = [];
  public g3_mapper_id = "";

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    name : new FormControl('', Validators.required),
    node_type_id : new FormControl(null, Validators.required),
    g3_mapper_platform_id : new FormControl(null),
    g3_mapper_input_one_id : new FormControl(null),
    g3_mapper_input_two_id : new FormControl(null)
  });

  initializeFormGroup()
  {
    this.form.setValue({
      id : null,
      name : '',
      node_type_id : null,
      g3_mapper_platform_id: null,
      g3_mapper_input_one_id : null,
      g3_mapper_input_two_id : null
    });
  }


  findByIdInTreeData(id)
  {
      return findByIdInList(this.tree_data, id);
  }

  insertMenuNode(menunode)
  {
      return this.addNewMenuNode(menunode);
  }



  findMenuNodes():  Observable<MenuNode[]>
  {
      return this.getMenuNodes();
  }

  populateForm(menunode, mapperPlatformID, mapperID, mapperIDTwo)
  {
    const {id, name, node_type_id} = menunode;
    const node = {id : id, name : name, node_type_id : node_type_id, g3_mapper_platform_id : mapperPlatformID, g3_mapper_input_one_id: mapperID, g3_mapper_input_two_id: mapperIDTwo};
    this.form.setValue(node);
  }

  setG3mapperID(g3_mapper_id)
  {
    this.g3_mapper_id = g3_mapper_id;
  }

  /////////

  addNewMenuNode(menunode: any) {

    console.log("ApiService addNewMenuNode");
    console.log("ApiService addNewMenuNode menunode: " + JSON.stringify(menunode));

    const bodyParams = {
        'name': menunode.name,
        'node_type_id' : +menunode.node_type_id,
        'g3mapper_id' : +this.g3_mapper_id
    };

    console.log("ApiService addNewMenuNode bodyParams: " + JSON.stringify(bodyParams));

    const url = `${this.serviceApiUrl}/${this.currentSelectedNodeId}/children`;
    return this.httpClient.post(url, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateMenuNode(menunode: any)
{
  console.log("ApiService updateMenuNode");
  console.log("ApiService updateMenuNode menunode: " + JSON.stringify(menunode));

  const bodyParams = {
      'name': menunode.name,
      'node_type_id': +menunode.node_type_id,
      'g3mapper_id' : +this.g3_mapper_id,
  };

  console.log("ApiService updateMenuNode bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${menunode.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteMenuNode(menunode: any)
{
  console.log("ApiService deleteMenuNode");
  console.log("ApiService deleteMenuNode menunode: " + JSON.stringify(menunode));

  return this.httpClient.delete(`${this.serviceApiUrl}/${menunode.id}`, { headers: Constants.HTTP_HEADERS});
}

getMenuNodes():  Observable<MenuNode[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS
    }).pipe(
        map(res =>  {

            this.tree_data = res as MenuNode[];

            this.messageService.sendMessage(Constants.NODE_TREE_LOADED);


            return res as MenuNode[];
        })
    );
}

findChildNodes():Observable<MenuNode[]> {

    return this.httpClient.get(`${this.serviceApiUrl}/${this.currentSelectedNodeId}/children`, {
        headers: Constants.HTTP_HEADERS
             
    }).pipe(
        map(res =>  {
            this.totalChildMenuNodesCount = parseInt(res["totalCount"]); 
            this.currentMenuNodeTree = res["items"];

            
            return res["items"];
        })
    );
}

getMapperPlatformByNodeID(menu_node_id: any)
{
  console.log("ApiService getMapperPlatformByNodeID");
  console.log("ApiService getMapperPlatformByNodeID menu_node_id: " + JSON.stringify(menu_node_id));

  return this.httpClient.get(`${this.serviceApiUrl}/${menu_node_id}`, { headers: Constants.HTTP_HEADERS });
}

}
