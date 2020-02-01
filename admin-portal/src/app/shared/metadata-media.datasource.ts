

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MetadataMedia } from './metadata-media.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MetadataMediaService } from './metadata-media.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';
import { MenuNodeMetadataService } from './menu-node-metadata.service';



export class MetadataMediaDataSource implements DataSource<MetadataMedia> {

    private metadatamediaSubject = new BehaviorSubject<MetadataMedia[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private metadatamediaService: MetadataMediaService,
        private menuMetadataService : MenuNodeMetadataService, 
        private dialogService : DialogService, 
        private authorizationService : AuthorizationService) {

    }

    loadMetadataMedia(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        


        this.loadingSubject.next(true);


        if(this.menuMetadataService.metadataExists == false)
        {
            this.metadatamediaService.totalMetadataMediaCount = 0;
            this.metadatamediaSubject.next([]);
            this.loadingSubject.next(false);
            return;
        }
             


        this.metadatamediaService.findMetadataMedia(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find metadata-media error ', err);
                    
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
            .subscribe(metadatamedia => {
                this.metadatamediaSubject.next(metadatamedia);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<MetadataMedia[]> {
        console.log("Connecting data source");
        return this.metadatamediaSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.metadatamediaSubject.complete();
        this.loadingSubject.complete();
    }

}

