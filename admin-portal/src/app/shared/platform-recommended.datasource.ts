

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { PlatformRecommended } from './platform-recommended.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { PlatformRecommendedService } from './platform-recommended.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class PlatformRecommendedsDataSource implements DataSource<PlatformRecommended> {

    private platformrecommendedsSubject = new BehaviorSubject<PlatformRecommended[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private platformrecommendedsService: PlatformRecommendedService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadPlatformRecommendeds(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.platformrecommendedsService.findPlatformRecommendeds(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find platform-recommendeds error ', err);
                    
                    this.dialogService.openHttpErrorDialog(err.error, err.status).afterClosed().subscribe(code => {
                        console.log('dialog response ', code);
                        if(code == 401)
                        {
                            this.authorizationService.authorize();
                        }
                    });

                    return of([]);
                }),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(platformrecommendeds => {
                this.platformrecommendedsSubject.next(platformrecommendeds);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<PlatformRecommended[]> {
        console.log("Connecting data source");
        return this.platformrecommendedsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.platformrecommendedsSubject.complete();
        this.loadingSubject.complete();
    }

}

