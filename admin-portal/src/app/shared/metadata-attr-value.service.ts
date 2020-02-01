import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { MetadataAttrValue } from './metadata-attr-value.model';
import { map } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';
import { MenuNodeMetadataService } from './menu-node-metadata.service';

@Injectable({
  providedIn: 'root'
})
export class MetadataAttrValueService {

  constructor(private httpClient: HttpClient, private env : EnvService,
    private metadataService : MenuNodeMetadataService) {

    this.serviceApiUrl = environment.apiUrl + Constants.ATTR_VALUE_ENDPOINT;
    this.metadataServiceApiUrl = environment.apiUrl + Constants.METADATA_ENDPOINT;
   }

  public totalMetadataAttrValueCount = 0;
  public defaultPageSize = 100;
  private serviceApiUrl; 
  private metadataServiceApiUrl;

  public form : FormGroup = new FormGroup({
    id : new FormControl(null),
    value : new FormControl('', Validators.required),
    attr_name_id : new FormControl(null),
    value2 : new FormControl(null),
    value3 : new FormControl(null),
    description : new FormControl(null),
    description2 : new FormControl(null),
    description3 : new FormControl(null),
  });



  initializeFormGroup()
  {
    this.form.setValue({

      id : null,
      value : '',
      attr_name_id : null,
      value2 : '',
      value3 : '',
      description: '',
      description2: '',
      description3: ''
    });
  }


  insertMetadataAttrValue(metadata_attr_value, count)
  {
      return this.addNewMetadataAttrValue(metadata_attr_value, count);
  }



  findMetadataAttrValue(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<MetadataAttrValue[]>
  {
      return this.getMetadataAttrValue(filter, sortOrder, sortColumn, page, pageSize);
  }

  populateForm(metadata_attr_value, metadata_attr_value2, metadata_attr_value3,
    metadata_attr_desc, metadata_attr_desc2, metadata_attr_desc3)
  {
    const {id, value, attr_name_id} = metadata_attr_value;
    const attr_value = {id: id, value: value, attr_name_id: +attr_name_id, value2: metadata_attr_value2, value3: metadata_attr_value3,
      description: metadata_attr_desc, description2: metadata_attr_desc2, description3: metadata_attr_desc3};
    this.form.setValue(attr_value);
  }


  /////////

  addNewMetadataAttrValue(metadata_attr_value: any, descriptionValueCount) {

    console.log("ApiService addNewMetadataAttrValue");
    console.log("ApiService addNewMetadataAttrValue metadata_attr_value: " + JSON.stringify(metadata_attr_value));
    console.log("ApiService addNewMetadataAttrValue descriptionValueCount: " + descriptionValueCount);

    let value = "";
    let value1 = metadata_attr_value.value;
    let value2 = metadata_attr_value.value2;
    let value3 = metadata_attr_value.value3;

    if (value3 == "") {

      if (value2 == "") {

        value = value1;
      } else {
        value = value1 + "||" + value2;
      }
    } else {
      
      value = value1 + "||" + value2 + "||" + value3;
    }

    let descriptionValue = [];
    if (descriptionValueCount == 0) {
      descriptionValue.push({"description": metadata_attr_value.description});
    } else if (descriptionValueCount == 1) {

      descriptionValue.push({"description": metadata_attr_value.description});
      descriptionValue.push({"description": metadata_attr_value.description2});
    } else if (descriptionValueCount == 2) {
      
      descriptionValue.push({"description": metadata_attr_value.description});
      descriptionValue.push({"description": metadata_attr_value.description2});
      descriptionValue.push({"description": metadata_attr_value.description3});
    }

    const bodyParams = {
        'value': value,
        'attr_name_id': +metadata_attr_value.attr_name_id,
        'descriptionValue': descriptionValue
    };



    console.log("ApiService addNewMetadataAttrValue bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(`${this.metadataServiceApiUrl}/${this.metadataService.currentSelectedMetadataId}/attr_values`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

updateMetadataAttrValue(metadata_attr_value: any, descriptionValueCount)
{
  console.log("ApiService updateMetadataAttrValue");
  console.log("ApiService updateMetadataAttrValue metadata_attr_value: " + JSON.stringify(metadata_attr_value));

  let value = "";
  let value1 = metadata_attr_value.value;
  let value2 = metadata_attr_value.value2;
  let value3 = metadata_attr_value.value3;

  if (value3 == "") {

    if (value2 == "") {

      value = value1;
    } else {
      value = value1 + "||" + value2;value1;
    }
  } else {
    
    value = value1 + "||" + value2 + "||" + value3;
  }

  let descriptionValue = [];
  if (descriptionValueCount == 0) {
    descriptionValue.push({"description": metadata_attr_value.description});
  } else if (descriptionValueCount == 1) {

    descriptionValue.push({"description": metadata_attr_value.description});
    descriptionValue.push({"description": metadata_attr_value.description2});
  } else if (descriptionValueCount == 2) {
    
    descriptionValue.push({"description": metadata_attr_value.description});
    descriptionValue.push({"description": metadata_attr_value.description2});
    descriptionValue.push({"description": metadata_attr_value.description3});
  }
  
  const bodyParams = {
    'value': value,
    'attr_name_id': +metadata_attr_value.attr_name_id,
    'descriptionValue': descriptionValue
  };

  console.log("ApiService updateMetadataAttrValue bodyParams: " + JSON.stringify(bodyParams));

  return this.httpClient.put(`${this.serviceApiUrl}/${metadata_attr_value.id}`, bodyParams, { headers: Constants.HTTP_HEADERS });
}

deleteMetadataAttrValue(metadata_attr_value: any)
{
  console.log("ApiService deleteMetadataAttrValue");
  console.log("ApiService deleteMetadataAttrValue metadata_attr_value: " + JSON.stringify(metadata_attr_value));

  return this.httpClient.delete(`${this.serviceApiUrl}/${metadata_attr_value.id}`, { headers: Constants.HTTP_HEADERS });
}

getMetadataAttrValue(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<MetadataAttrValue[]> {

    return this.httpClient.get(`${this.metadataServiceApiUrl}/${this.metadataService.currentSelectedMetadataId}/attr_values`, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalMetadataAttrValueCount = parseInt(res["totalCount"]); 
            return res["items"];
        })
    );
}

}
