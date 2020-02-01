

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MenuNodeMetadata } from './menu-node-metadata.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MenuNodeMetadataService } from './menu-node-metadata.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class MenuNodeMetadataDataSource implements DataSource<MenuNodeMetadata> {

    private menunodemetadatasSubject = new BehaviorSubject<MenuNodeMetadata[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private menunodemetadatasService: MenuNodeMetadataService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadMenuNodeMetadata() {

        this.loadingSubject.next(true);

        this.menunodemetadatasService.findMenuNodeMetadata().pipe(
                catchError(err => {
                    console.log('find menu-node-metadata error ', err);
                    
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
            .subscribe(menunodemetadatas => {
                this.menunodemetadatasSubject.next(menunodemetadatas);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<MenuNodeMetadata[]> {
        console.log("Connecting data source");
        return this.menunodemetadatasSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.menunodemetadatasSubject.complete();
        this.loadingSubject.complete();
    }

}

