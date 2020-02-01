

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Platform } from './platform.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { CoreDataPlatformService } from './core-data-platform.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';
 



export class CoreDataPlatformsDataSource implements DataSource<Platform> {

    private platformsSubject = new BehaviorSubject<Platform[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private platformsService: CoreDataPlatformService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadPlatforms(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.platformsService.findPlatforms(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find platforms error ', err);
                    
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
            .subscribe(platforms => {
                this.platformsSubject.next(platforms);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<Platform[]> {
        console.log("Connecting data source");
        return this.platformsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.platformsSubject.complete();
        this.loadingSubject.complete();
    }

}

