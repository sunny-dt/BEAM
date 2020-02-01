

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MenuNodeType } from './menu-node-type.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MenuNodeTypeService } from './menu-node-type.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class MenuNodeTypesDataSource implements DataSource<MenuNodeType> {

    private menuNodeTypesSubject = new BehaviorSubject<MenuNodeType[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private menuNodeTypesService: MenuNodeTypeService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }

    loadMenuNodeTypes(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.menuNodeTypesService.findMenuNodeTypes(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(err => {
                    console.log('find menuNodeTypes error ', err);
                    
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
            .subscribe(menuNodeTypes => {
                this.menuNodeTypesSubject.next(menuNodeTypes);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<MenuNodeType[]> {
        console.log("Connecting data source");
        return this.menuNodeTypesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.menuNodeTypesSubject.complete();
        this.loadingSubject.complete();
    }

}

