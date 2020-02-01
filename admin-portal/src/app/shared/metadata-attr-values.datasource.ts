

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MetadataAttrValue } from './metadata-attr-value.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MetadataAttrValueService } from './metadata-attr-value.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';
import { MenuNodeMetadataService } from './menu-node-metadata.service';



export class MetadataAttrValueDataSource implements DataSource<MetadataAttrValue> {

    private metadataAttrValuesSubject = new BehaviorSubject<MetadataAttrValue[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private metadataAttrValueService: MetadataAttrValueService,
        private menuMetadataService : MenuNodeMetadataService,
         private dialogService : DialogService,
          private authorizationService : AuthorizationService) {

    }

    loadMetadataAttrValue(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);


        if(this.menuMetadataService.metadataExists == false)
        {
            this.metadataAttrValueService.totalMetadataAttrValueCount = 0;
            this.metadataAttrValuesSubject.next([]);
            this.loadingSubject.next(false);
            return;
        }


        this.metadataAttrValueService.findMetadataAttrValue(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find metadata-attr-value error ', err);
                    
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
            .subscribe(metadataAttrValues => {
                this.metadataAttrValuesSubject.next(metadataAttrValues);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<MetadataAttrValue[]> {
        console.log("Connecting data source");
        return this.metadataAttrValuesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.metadataAttrValuesSubject.complete();
        this.loadingSubject.complete();
    }

}

