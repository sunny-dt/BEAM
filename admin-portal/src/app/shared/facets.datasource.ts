

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Facet } from './facet.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { FacetService } from './facet.service';



export class FacetsDataSource implements DataSource<Facet> {

    private facetsSubject = new BehaviorSubject<Facet[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private facetsService: FacetService) {

    }

    loadFacets(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.facetsService.findFacets(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(facets => {
                this.facetsSubject.next(facets);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Facet[]> {
        console.log("Connecting data source");
        return this.facetsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.facetsSubject.complete();
        this.loadingSubject.complete();
    }

}

