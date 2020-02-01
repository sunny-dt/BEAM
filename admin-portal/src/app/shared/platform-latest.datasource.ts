

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { PlatformLatest } from './platform-latest.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { PlatformLatestService } from './platform-latest.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class PlatformLatestsDataSource implements DataSource<PlatformLatest> {

    private platformlatestsSubject = new BehaviorSubject<PlatformLatest[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private platformlatestsService: PlatformLatestService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadPlatformLatests(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.platformlatestsService.findPlatformLatests(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find platform-latests error ', err);
                    
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
            .subscribe(platformlatests => {
                this.platformlatestsSubject.next(platformlatests);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<PlatformLatest[]> {
        console.log("Connecting data source");
        return this.platformlatestsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.platformlatestsSubject.complete();
        this.loadingSubject.complete();
    }

}

