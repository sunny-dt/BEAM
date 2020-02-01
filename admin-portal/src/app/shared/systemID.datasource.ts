

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Chamber } from './chamber.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ChamberService } from './chamber.service';
import { FabService } from './fab.service';
import { SystemIDService } from './systemID.service';



export class SystemIDDataSource implements DataSource<Chamber> {

    private chambersSubject = new BehaviorSubject<Chamber[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private systemIDService: SystemIDService) {

    }

    loadSystemID(customerId,
        filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.systemIDService.findSystemID(customerId, filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(chambers => {
                console.log('fabService findSystemID chambers: ', chambers);
                this.chambersSubject.next(chambers);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Chamber[]> {
        console.log("Connecting data source");
        return this.chambersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.chambersSubject.complete();
        this.loadingSubject.complete();
    }

}

