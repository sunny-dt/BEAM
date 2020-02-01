import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, empty, of } from 'rxjs';
import { MenuNodeMetadata } from './menu-node-metadata.model';
import { map, startWith } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';
import { MenuNodeService } from './menu-node.service';
import { MessageService } from './global-message.service';

@Injectable({
  providedIn: 'root'
})
export class MenuNodeMetadataService {

  constructor(private httpClient: HttpClient, 
    private env : EnvService, 
    private menuNodeService : MenuNodeService,
    private messageService : MessageService) {

    this.serviceApiUrl = environment.apiUrl + Constants.METADATA_ENDPOINT;
    this.menuNodeServiceApiUrl = environment.apiUrl + Constants.MENUNODE_ENDPOINT;
   }

  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 
  private menuNodeServiceApiUrl;
  public metadataExists = true;

  public currentSelectedMetadataId = 0;

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),

    description : new FormControl(null),
    search_keywords : new FormControl(''),
    url : new FormControl(''),
    tile_fg_color : new FormControl('#ffffff', Validators.required),
    tile_bg_color : new FormControl('#4599c3', Validators.required),
    tile_image_filename : new FormControl(null),
    tile_image_link : new FormControl(null)
  });

  initializeFormGroup()
  {
    this.form.setValue({
    id : null,
    description : '',
    search_keywords : '',
    url : '',
    tile_bg_color : '#ffffff',
    tile_fg_color : '#4599c3',
    tile_image_filename : '',
    tile_image_link : ''
    });
  }

  insertMenuNodeMetadata(menu_node_metadata)
  {
      return this.addNewMenuNodeMetadata(menu_node_metadata);
  }



  findMenuNodeMetadata(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<MenuNodeMetadata[]>
  {
      return this.getMenuNodeMetadata(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(menu_node_metadata)
  {
     const {id, text, search_keywords, url, tile_bg_color, tile_fg_color, tile_image_filename, tile_image_link} = menu_node_metadata;
     const metadata = {id: id, description: text, search_keywords : search_keywords, url: url, tile_bg_color:tile_bg_color, tile_fg_color:tile_fg_color, tile_image_filename:tile_image_filename, tile_image_link:tile_image_link};
     this.form.setValue(metadata);
  }


  /////////

  addNewMenuNodeMetadata(menu_node_metadata: any) {

    console.log("ApiService addNewMenuNodeMetadata");
    console.log("ApiService addNewMenuNodeMetadata menu_node_metadata: " + JSON.stringify(menu_node_metadata));

    const bodyParams = {
       'description' : menu_node_metadata.description,
       'search_keywords': menu_node_metadata.search_keywords,
        'url' :  menu_node_metadata.url,
        'tile_bg_color' : menu_node_metadata.tile_bg_color,
        'tile_fg_color' : menu_node_metadata.tile_fg_color,
        'tile_image_filename' : menu_node_metadata.tile_image_filename,
        'tile_image_link' : menu_node_metadata.tile_image_link
    };



    console.log("ApiService addNewMenuNodeMetadata bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(`${this.menuNodeServiceApiUrl}/${this.menuNodeService.currentSelectedNodeId}/metadata`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateMenuNodeMetadata(menu_node_metadata: any)
{
  console.log("ApiService updateMenuNodeMetadata");
  console.log("ApiService updateMenuNodeMetadata menu_node_metadata: " + JSON.stringify(menu_node_metadata));

  const bodyParams = {
    'description' : menu_node_metadata.description,
    'search_keywords':menu_node_metadata.search_keywords,
    'url' :  menu_node_metadata.url,
    'tile_bg_color' : menu_node_metadata.tile_bg_color,
    'tile_fg_color' : menu_node_metadata.tile_fg_color,
    'tile_image_filename' : menu_node_metadata.tile_image_filename,
    'tile_image_link' : menu_node_metadata.tile_image_link
  };

  console.log("ApiService updateMenuNodeMetadata bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${menu_node_metadata.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteMenuNodeMetadata(menu_node_metadata: any)
{
  console.log("ApiService deleteMenuNodeMetadata");
  console.log("ApiService deleteMenuNodeMetadata menu_node_metadata: " + JSON.stringify(menu_node_metadata));

  return this.httpClient.delete(`${this.serviceApiUrl}/${menu_node_metadata.id}`, { headers: Constants.HTTP_HEADERS });
}

getMenuNodeMetadata(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<MenuNodeMetadata[]> {


      this.metadataExists = true;
    return this.httpClient.get(`${this.menuNodeServiceApiUrl}/${this.menuNodeService.currentSelectedNodeId}/metadata`, {
        headers: Constants.HTTP_HEADERS
    }).pipe(
        map(res =>  {
            
          const items = [];
            if(res['id'] == undefined)
            {
              this.metadataExists = false;
            }
            else
            {
              items[0] = res;
              this.metadataExists = true;
              this.currentSelectedMetadataId = res['id'];
            }
            
            this.messageService.sendMessage(Constants.METADATA_LOADED);

            return items;
        })
    );
}

}
