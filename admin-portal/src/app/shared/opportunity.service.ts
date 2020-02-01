import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Opportunity } from './opportunity.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EnvService } from '../env.service';
import { Constants } from './constants';
import {map} from "rxjs/operators";
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {

  constructor(private httpClient: HttpClient, private env : EnvService) {

    //this.serviceApiUrl = this.env.apiUrl + Constants.OPPORTUNITY_ENDPOINT;
    this.serviceApiUrl = environment.apiUrl + Constants.OPPORTUNITY_ENDPOINT;

  }

  public totalOpportunitiesCount = 0;
  public defaultPageSize = Constants.DEFAULT_PAGE_SIZE;
  private serviceApiUrl; 

 


  findOpportunities(filter = '', sortColumn='id', sortOrder = 'asc', page = 1, pageSize = 10):  Observable<Opportunity[]>
  {
      return this.getOpportunities(filter, sortOrder, sortColumn, page, pageSize);
  }




deleteOpportunity(opportunity: any)
{
  console.log("ApiService deleteOpportunity");
  console.log("ApiService deleteOpportunity opportunity: " + JSON.stringify(opportunity));

  return this.httpClient.delete(`${this.serviceApiUrl}/${opportunity.id}`, { headers: Constants.HTTP_HEADERS });
}

getOpportunities(filter = '', sortOrder = 'asc', sortColumn='id',
    page = 1, pageSize = 10):  Observable<Opportunity[]> {

    return this.httpClient.get(this.serviceApiUrl, {
        headers: Constants.HTTP_HEADERS,
        params: new HttpParams()
            .set('filter', filter)
            .set('sortBy', sortColumn)
            .set('sortOrder', sortOrder)
            .set('page', page.toString())
            .set('pageSize', pageSize.toString())
    }).pipe(
        map(res =>  {
            this.totalOpportunitiesCount = parseInt(res["totalCount"]); 
            // let items = [];
            // for (const i in res["items"]) {
              
            //   const c_date = res["items"][i].c_date;
            //   let convertedDateString = c_date.toLocaleString(); 
            //   convertedDateString = convertedDateString.replace('at ', ''); 
            //   let convertedDate = new Date(convertedDateString);
            //   items[i].c_date = convertedDate;
            // }
            return res["items"];
        })
    );
}


}
