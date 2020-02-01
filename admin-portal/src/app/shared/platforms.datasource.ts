

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { Platform } from './platform.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { PlatformService } from './platform.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';
import { BuilderPlatformService } from './builder-platform.service';



export class PlatformsDataSource implements DataSource<Platform> {

    private platformsSubject = new BehaviorSubject<Platform[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private platformsService: PlatformService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

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

