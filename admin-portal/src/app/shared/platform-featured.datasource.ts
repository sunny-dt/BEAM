

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { PlatformFeatured } from './platform-featured.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { PlatformFeaturedService } from './platform-featured.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class PlatformFeaturedsDataSource implements DataSource<PlatformFeatured> {

    private platformfeaturedsSubject = new BehaviorSubject<PlatformFeatured[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private platformfeaturedsService: PlatformFeaturedService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadPlatformFeatureds(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.platformfeaturedsService.findPlatformFeatureds(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find platform-featureds error ', err);
                    
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
            .subscribe(platformfeatureds => {
                this.platformfeaturedsSubject.next(platformfeatureds);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<PlatformFeatured[]> {
        console.log("Connecting data source");
        return this.platformfeaturedsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.platformfeaturedsSubject.complete();
        this.loadingSubject.complete();
    }

}

