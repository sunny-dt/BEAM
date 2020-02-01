import { HttpClient } from '@angular/common/http';
import { Constants } from './constants';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsCustomersService {

  private serviceApiUrl; 

  constructor(private httpClient: HttpClient) {

    this.serviceApiUrl = environment.apiUrl + Constants.ANALYTICS_ENDPOINT;
  }
  
  getSaleAnalyticsCustomersNameFilter(value) {

    const bodyParams = {

        'customerName': [],
        'chamberName': [],
        'value': value
    }

    let finalURL = this.serviceApiUrl + "/getSaleAnalyticsCustomersName";

    console.log("ApiService getSaleAnalyticsCustomersNameFilter bodyParams: ", JSON.stringify(bodyParams));
    return this.httpClient.post(finalURL, bodyParams, { headers: Constants.HTTP_HEADERS });
}

getAllSalesAnalyticsOtherCustomersCount() {

    let finalURL = this.serviceApiUrl + "/getAllSalesAnalyticsOtherCustomersCount";
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherCustomersCount finalURL: " + finalURL);
    
    return this.httpClient.get(finalURL, { headers: Constants.HTTP_HEADERS });
  }

  postAllSalesAnalyticsOtherCustomersCount(value) {

    const bodyParams = {

      'value': value
    }

    let finalURL = this.serviceApiUrl + "/getAllSalesAnalyticsOtherCustomersCount";
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherCustomersCount finalURL: " + finalURL);
    console.log("AnalyticsChambersService getAllSalesAnalyticsOtherCustomersCount bodyParams: " + JSON.stringify(bodyParams));

    return this.httpClient.post(finalURL, bodyParams, { headers: Constants.HTTP_HEADERS });
  }
}