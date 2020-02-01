

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Opportunity } from './opportunity.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { OpportunityService } from './opportunity.service';



export class OpportunitiesDataSource implements DataSource<Opportunity> {

    private opportunitiesSubject = new BehaviorSubject<Opportunity[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private opportunitiesService: OpportunityService) {

    }

    loadOpportunitys(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.opportunitiesService.findOpportunities(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(opportunities => {
                this.opportunitiesSubject.next(opportunities)
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Opportunity[]> {
        console.log("Connecting data source");
        return this.opportunitiesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.opportunitiesSubject.complete();
        this.loadingSubject.complete();
    }

}

