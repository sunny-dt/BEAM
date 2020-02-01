import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MetadataAttrType } from './metadata-attr-type.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetadataAttrTypeService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    this.serviceApiUrl = environment.apiUrl + Constants.METADATA_ATTR_TYPE_ENDPOINT;
    
   }

  private serviceApiUrl; 

  



getMetadataAttrTypes():  Observable<MetadataAttrType[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS
    }).pipe(
        map(res =>  {
            return res as MetadataAttrType[];
        })
    );
}

}
