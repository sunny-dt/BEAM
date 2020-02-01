import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { UpgradeRulesComponent } from './upgrade-rules.component';
import { BuilderUpgradeRulesDataSource } from 'src/app/shared/builder-upgrade-rules.datasource';
import { BuilderUpgradeRulesService } from 'src/app/shared/builder-upgrade-rules.service';

@Component({
  selector: 'app-upgrade-rules-list.component',
  templateUrl: './upgrade-rules-list.component.html',
  styleUrls: ['./upgrade-rules-list.component.css']
})

export class UpgradeRulesListComponent implements OnInit {

  dataSource: BuilderUpgradeRulesDataSource;

  displayedColumns= ["Upgraderuleid", "platform_family_name", "chamber_family_name", "actions"];

  title = "";

  constructor(private builderUpgradeRulesService: BuilderUpgradeRulesService,
    private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new BuilderUpgradeRulesDataSource(this.builderUpgradeRulesService);
    
    this.loadUpgradeRulesMappingsPage()
  }

  ngAfterViewInit()
  {
     
  }

  loadUpgradeRulesMappingsPage() {
    this.dataSource.loadUpgradeRulesMappingsPage();
  }

  onCreate()
  {

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "60%";
    dialogConfig.data = {ruleID : "", dialogData: {}}
    this.dialog.open(UpgradeRulesComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadUpgradeRulesMappingsPage();
      }
    });
  }

  onEdit(row)
  {
    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    dialogConfig.data = {ruleID : row.Upgraderuleid, dialogData: row}
    this.dialog.open(UpgradeRulesComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadUpgradeRulesMappingsPage();
      }
    });
  }

  onDelete(row)
  {


    this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
      if(res)
      {
        this.builderUpgradeRulesService.deleteUpgradeChamberRules(row.Upgraderuleid).subscribe(response => {

          console.log("Response - deleteUpgradeChamberRules : ", response);
          this.notificationService.success("Deleted successfully");
          this.loadUpgradeRulesMappingsPage();
          
        }, error => {
    
          this.notificationService.failure(error.error);
        });
      }
    });
  }

  


}
