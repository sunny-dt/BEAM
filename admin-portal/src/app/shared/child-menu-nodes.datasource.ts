

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { MenuNode } from './menu-node.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { MenuNodeService } from './menu-node.service';
import { DialogService } from './dialog.service';
import { AuthorizationService } from './authServices/authorization.service';



export class ChildMenuNodesDataSource implements DataSource<MenuNode> {

    public menunodesSubject = new BehaviorSubject<MenuNode[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();






    constructor(private menunodesService: MenuNodeService, private dialogService : DialogService, private authorizationService : AuthorizationService) {

    }



    loadChildNodes(){

        this.loadingSubject.next(true);
        this.menunodesService.findChildNodes().pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(menunodes => {
            this.menunodesSubject.next(menunodes);
            this.loadingSubject.next(false);
        });
    }

   

    connect(collectionViewer: CollectionViewer): Observable<MenuNode[]> {
        console.log("Connecting data source");
        return this.menunodesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.menunodesSubject.complete();
        this.loadingSubject.complete();
    }

}

