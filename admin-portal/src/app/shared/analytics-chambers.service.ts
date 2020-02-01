import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsChambersService {

  private serviceApiUrl; 

  constructor(private httpClient: HttpClient) {

    this.serviceApiUrl = environment.apiUrl + Constants.ANALYTICS_ENDPOINT;
  }
  
  getSaleAnalyticsForAllChambersFilter(value) {

    const bodyParams = {
      'chamberName': [],
      'customerName': [],
      'value': value
    }

    let finalURL = this.serviceApiUrl + "/getSaleAnalyticsForAllChambers";

    console.log("AnalyticsChambersService getSaleAnalyticsForAllChambersFilter finalURL: " + finalURL);
    console.log("AnalyticsChambersService getSaleAnalyticsForAllChambersFilter bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(finalURL, bodyParams, { headers: Constants.HTTP_HEADERS });
  }

  getAllSalesAnalyticsOtherChambersCount() {

    let finalURL = this.serviceApiUrl + "/getAllSalesAnalyticsOtherChambersCount";
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherChambersCount finalURL: " + finalURL);
    
    return this.httpClient.get(finalURL, { headers: Constants.HTTP_HEADERS });
  }

  postAllSalesAnalyticsOtherChambersCount(value) {

    const bodyParams = {

      'value': value
    }

    let finalURL = this.serviceApiUrl + "/getAllSalesAnalyticsOtherChambersCount";
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherChambersCount finalURL: " + finalURL);
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherChambersCount bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(finalURL, bodyParams, { headers: Constants.HTTP_HEADERS });
  }
}