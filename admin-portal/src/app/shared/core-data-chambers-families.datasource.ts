

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Chamber } from './chamber.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
// import { ChamberService } from './chamber.service';
import { CoreDataChamberFamiliesService } from './core-data-chambers-families.service';
 



export class CoreDataChambersFamilyDataSource implements DataSource<any> {

    private chamberFamiliesSubject = new BehaviorSubject<any[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private chamberFamiliesService: CoreDataChamberFamiliesService) {

    }

    loadChambers(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.chamberFamiliesService.findChamberFamilies(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(ChamberFamilies => {

                console.log("Connecting data source ChamberFamilies: ", ChamberFamilies);
                this.chamberFamiliesService.totalChamberFamiliesCount = ChamberFamilies.length;
                this.chamberFamiliesSubject.next(ChamberFamilies);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Chamber[]> {
        console.log("Connecting data source");
        return this.chamberFamiliesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.chamberFamiliesSubject.complete();
        this.loadingSubject.complete();
    }

}

