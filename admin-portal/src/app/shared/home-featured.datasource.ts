

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { HomeFeatured } from './home-featured.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { HomeFeaturedService } from './home-featured.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class HomeFeaturedsDataSource implements DataSource<HomeFeatured> {

    private homefeaturedsSubject = new BehaviorSubject<HomeFeatured[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private homefeaturedsService: HomeFeaturedService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadHomeFeatureds(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.homefeaturedsService.findHomeFeatureds(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find home-featureds error ', err);
                    
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
            .subscribe(homefeatureds => {
                this.homefeaturedsSubject.next(homefeatureds);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<HomeFeatured[]> {
        console.log("Connecting data source");
        return this.homefeaturedsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.homefeaturedsSubject.complete();
        this.loadingSubject.complete();
    }

}

