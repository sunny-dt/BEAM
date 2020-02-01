import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import { BehaviorSubject, of, Observable } from 'rxjs';
import { BuilderConfigChangeRulesService } from './builder-config-change-rules.service';

export class BuilderConfigChangeRulesDataSource implements DataSource<any> {

    private configChangeRulesSubject = new BehaviorSubject<any>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private builderConfigChangeRulesService: BuilderConfigChangeRulesService) {

    }

    loadConfigChangeRulesMappingsPage() {

        this.loadingSubject.next(true);

        this.builderConfigChangeRulesService.getAllConfigChangeChambersRules().pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(rulesMappings => {

                console.log("loadConfigChangeRulesMappingsPage rulesMappings ", rulesMappings);
                this.builderConfigChangeRulesService.totalCount = JSON.parse(JSON.stringify(rulesMappings)).length;
                console.log("loadConfigChangeRulesMappingsPage builderConfigChangeRulesService totalCount ", this.builderConfigChangeRulesService.totalCount);

                this.configChangeRulesSubject.next(rulesMappings);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<any> {
        console.log("Connecting data source");
        return this.configChangeRulesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.configChangeRulesSubject.complete();
        this.loadingSubject.complete();
    }

}

