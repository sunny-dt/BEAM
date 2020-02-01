import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MetadataMedia } from './metadata-media.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';
import { MenuNodeMetadataService } from './menu-node-metadata.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataMediaService {

  constructor(private httpClient: HttpClient, private env : EnvService,
    private metadataService : MenuNodeMetadataService) {

    this.serviceApiUrl = environment.apiUrl + Constants.MEDIA_ENDPOINT;
    this.metadataServiceApiUrl = environment.apiUrl + Constants.METADATA_ENDPOINT;
   }

  public totalMetadataMediaCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 
  private metadataServiceApiUrl;

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),

    media_type : new FormControl(null, Validators.required),
    media_filename : new FormControl(null, Validators.required),
    media_file_url : new FormControl(null),
    serial_order : new FormControl(1)

  });

  initializeFormGroup()
  {
    this.form.setValue({

      id : null,
      media_type : null,
      media_filename : null,
      media_file_url : null,
      serial_order : 1
    });
  }

  insertMetadataMedia(metadata_media)
  {
      return this.addNewMetadataMedia(metadata_media);
  }



  findMetadataMedia(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<MetadataMedia[]>
  {
      return this.getMetadataMedia(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(metadata_media)
  {
    const {id, serial_order, media_type,  media_filename, media_file_url} = metadata_media;
    const media = {id: id, serial_order: serial_order, media_type: media_type, media_filename: media_filename, media_file_url:media_file_url};
    this.form.setValue(media);
  }


  /////////

  addNewMetadataMedia(metadata_media: any) {

    console.log("ApiService addNewMetadataMedia");
    console.log("ApiService addNewMetadataMedia metadata_media: " + JSON.stringify(metadata_media));

    const bodyParams = {
        'serial_order': metadata_media.serial_order,
        'media_filename': metadata_media.media_filename,
        "media_file_url": metadata_media.media_file_url,
        "media_type" : metadata_media.media_type
    };



    console.log("ApiService addNewMetadataMedia bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(`${this.metadataServiceApiUrl}/${this.metadataService.currentSelectedMetadataId}/media`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateMetadataMedia(metadata_media: any)
{
  console.log("ApiService updateMetadataMedia");
  console.log("ApiService updateMetadataMedia metadata_media: " + JSON.stringify(metadata_media));

  const bodyParams = {
    'serial_order': metadata_media.serial_order,
    'media_filename': metadata_media.media_filename,
    "media_file_url": metadata_media.media_file_url,
    "media_type" : metadata_media.media_type
  };

  console.log("ApiService updateMetadataMedia bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${metadata_media.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteMetadataMedia(metadata_media: any)
{
  console.log("ApiService deleteMetadataMedia");
  console.log("ApiService deleteMetadataMedia metadata_media: " + JSON.stringify(metadata_media));

  return this.httpClient.delete(`${this.serviceApiUrl}/${metadata_media.id}`, { headers: Constants.HTTP_HEADERS });
}

getMetadataMedia(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<MetadataMedia[]> {

    return this.httpClient.get(`${this.metadataServiceApiUrl}/${this.metadataService.currentSelectedMetadataId}/media`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalMetadataMediaCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
