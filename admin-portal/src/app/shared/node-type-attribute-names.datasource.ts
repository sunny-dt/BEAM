

import {CollectionViewer, DataSource} from "@angular/cdk/collections";

import {catchError, finalize} from "rxjs/operators";

import { NodeTypeAttributeName } from './node-type-attribute-name.model';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { NodeTypeAttributeNameService } from './node-type-attribute-name.service';



export class NodeTypeAttributeNamesDataSource implements DataSource<NodeTypeAttributeName> {

    private nodeTypeAttributeNamesSubject = new BehaviorSubject<NodeTypeAttributeName[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();


    public data : NodeTypeAttributeName[] = [];

    constructor(private nodeTypeAttributeNameService: NodeTypeAttributeNameService) {

    }

    loadNodeTypeAttributeNames(filter:string, 
        sortColumn:string,
        sortOrder:string, 
        page:number, 
        pageSize:number) {

        this.loadingSubject.next(true);

        this.nodeTypeAttributeNameService.findNodeTypeAttributeNames(filter,
            sortColumn,  
            sortOrder, 
            page, 
            pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(nodeTypeAttributeNames => {
                this.data = nodeTypeAttributeNames
                this.nodeTypeAttributeNamesSubject.next(this.data);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<NodeTypeAttributeName[]> {
        console.log("Connecting data source");
        return this.nodeTypeAttributeNamesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.nodeTypeAttributeNamesSubject.complete();
        this.loadingSubject.complete();
    }

}

