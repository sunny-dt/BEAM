

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { HomeLatest } from './home-latest.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { HomeLatestService } from './home-latest.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class HomeLatestsDataSource implements DataSource<HomeLatest> {

    private homelatestsSubject = new BehaviorSubject<HomeLatest[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private homelatestsService: HomeLatestService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadHomeLatests(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.homelatestsService.findHomeLatests(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find home-latests error ', err);
                    
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
            .subscribe(homelatests => {
                this.homelatestsSubject.next(homelatests);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<HomeLatest[]> {
        console.log("Connecting data source");
        return this.homelatestsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.homelatestsSubject.complete();
        this.loadingSubject.complete();
    }

}

