import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {catchError, finalize} from "rxjs/operators";
import { BehaviorSubject, of, Observable } from 'rxjs';
import { BuilderUpgradeRulesService } from './builder-upgrade-rules.service';

export class BuilderUpgradeRulesDataSource implements DataSource<any> {

    private upgradeRulesSubject = new BehaviorSubject<any>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private builderUpgradeRulesService: BuilderUpgradeRulesService) {

    }

    loadUpgradeRulesMappingsPage() {

        this.loadingSubject.next(true);

        this.builderUpgradeRulesService.getAllUpgradeChamberRules().pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(upgradeRulesMappings => {

                console.log("loadUpgradeRulesMappingsPage upgradeRulesMappings ", upgradeRulesMappings);
                this.builderUpgradeRulesService.totalCount = JSON.parse(JSON.stringify(upgradeRulesMappings)).length;
                console.log("loadUpgradeRulesMappingsPage builderUpgradeRulesService totalCount ", this.builderUpgradeRulesService.totalCount);

                this.upgradeRulesSubject.next(upgradeRulesMappings);
                this.loadingSubject.next(false);
            });

    }

   

    connect(collectionViewer: CollectionViewer): Observable<any> {
        console.log("Connecting data source");
        return this.upgradeRulesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.upgradeRulesSubject.complete();
        this.loadingSubject.complete();
    }

}

