

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MenunodeRecommended } from './menu-node-recommended.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MenunodeRecommendedService } from './menu-node-recommended.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class MenunodeRecommendedsDataSource implements DataSource<MenunodeRecommended> {

    private menunodeRecommendedsSubject = new BehaviorSubject<MenunodeRecommended[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private menunodeRecommendedsService: MenunodeRecommendedService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadMenunodeRecommendeds() {

        this.loadingSubject.next(true);

        this.menunodeRecommendedsService.findMenunodeRecommendeds().pipe(
                catchError(err => {
                    console.log('find menu-node-recommendeds error ', err);
                    
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
            .subscribe(menunodeRecommendeds => {
                this.menunodeRecommendedsSubject.next(menunodeRecommendeds);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<MenunodeRecommended[]> {
        console.log("Connecting data source");
        return this.menunodeRecommendedsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.menunodeRecommendedsSubject.complete();
        this.loadingSubject.complete();
    }

}

