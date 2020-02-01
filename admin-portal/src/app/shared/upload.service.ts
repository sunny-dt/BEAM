import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { EnvService } from '../env.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.FILE_UPLOAD_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.FILE_UPLOAD_ENDPOINT;
    this.featuredImageUploadServiceUrl = environment.apiUrl + Constants.FEATURED_FILE_UPLOAD_ENDPOINT;
    this.latestImageUploadServiceUrl = environment.apiUrl + Constants.LATEST_FILE_UPLOAD_ENDPOINT;
    this.recommendedImageUploadServiceUrl = environment.apiUrl + Constants.RECOMMENDED_FILE_UPLOAD_ENDPOINT;
  }


  private serviceApiUrl; 
  private featuredImageUploadServiceUrl;
  private latestImageUploadServiceUrl;
  private recommendedImageUploadServiceUrl;



  uploadFile(selectedFile : any)
  {
    const uploadData = new FormData();
    uploadData.append('modelSvg', selectedFile, selectedFile.name);
  
    return this.httpClient.post(this.serviceApiUrl, uploadData, {
      headers : Constants.MULTIPART_FORM_DATA_HEADERS,
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadFeaturedFile(selectedFile : any)
  {
    const uploadData = new FormData();
    uploadData.append('featuredPng', selectedFile, selectedFile.name);
  
    return this.httpClient.post(this.featuredImageUploadServiceUrl, uploadData, {
      headers : Constants.MULTIPART_FORM_DATA_HEADERS,
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadLatestFile(selectedFile : any)
  {
    const uploadData = new FormData();
    uploadData.append('latestPng', selectedFile, selectedFile.name);
  
    return this.httpClient.post(this.latestImageUploadServiceUrl, uploadData, {
      headers : Constants.MULTIPART_FORM_DATA_HEADERS,
      reportProgress: true,
      observe: 'events'
    });
  }

  uploadRecommendedFile(selectedFile : any, mediaType : string = 'image')
  {
    const uploadData = new FormData();
    uploadData.append('recommendedPng', selectedFile, selectedFile.name);
  
    return this.httpClient.post(`${this.recommendedImageUploadServiceUrl}?media_type=${mediaType}`, uploadData, {
      headers : Constants.MULTIPART_FORM_DATA_HEADERS,
      reportProgress: true,
      observe: 'events'
    })
    
    

  }


  

}
