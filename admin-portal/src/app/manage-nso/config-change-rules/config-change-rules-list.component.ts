import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {MatPaginator, MatSort, MatDialog, MatDialogConfig} from "@angular/material";
import { ProductConfigMappingService } from 'src/app/shared/product-config-mapping.service';
import { ProductConfigMappingsDataSource } from 'src/app/shared/product-config-mappings.datasource';
import { fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';
import { ActivatedRoute, Router, Route } from '@angular/router';
import { ConfigChangeRulesComponent } from './config-change-rules.component';
import { BuilderConfigChangeRulesDataSource } from 'src/app/shared/builder-config-change-rules.datasource';
import { BuilderConfigChangeRulesService } from 'src/app/shared/builder-config-change-rules.service';

@Component({
 selector: 'app-config-change-rules-list.component',
  templateUrl: './config-change-rules-list.component.html',
  styleUrls: ['./config-change-rules-list.component.css']
})
export class ConfigChangeRulesListComponent implements OnInit {

  dataSource: BuilderConfigChangeRulesDataSource;

  displayedColumns= ["ruleid", "platform_family_name", "chamber_family_name", "actions"];

  title = "";

  constructor(public builderConfigChangeRulesService : BuilderConfigChangeRulesService, private dialog : MatDialog,
    private notificationService : NotificationService,
    private dialogService : DialogService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit() {

    this.dataSource = new BuilderConfigChangeRulesDataSource(this.builderConfigChangeRulesService);
    
    this.loadProductConfigMappingsPage()
  }

  ngAfterViewInit()
  {
     
  }

  loadProductConfigMappingsPage() {
    this.dataSource.loadConfigChangeRulesMappingsPage();
  }

  

  onCreate()
  {

    const dialogConfig = new MatDialogConfig;
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.width = "60%";
    dialogConfig.data = {ruleID : ""}
    this.dialog.open(ConfigChangeRulesComponent, dialogConfig).afterClosed().subscribe(data => {
      console.log(data);
      if(data)
      {
        this.loadProductConfigMappingsPage();
      }
    });
  }

  onEdit(row)
  {
    // this.productConfigMappingService.populateForm(row);

    // const dialogConfig = new MatDialogConfig;
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "60%";
    // this.dialog.open(UpgradeRulesComponent, dialogConfig).afterClosed().subscribe(data => {
    //   console.log(data);
    //   if(data)
    //   {
    //     this.loadProductConfigMappingsPage();
    //   }
    // });
  }

  onDelete(productConfigMapping)
  {


    // this.dialogService.openConfirmDialog('Confirm Delete ?').afterClosed().subscribe(res => {
    //   if(res)
    //   {
    //     this.productConfigMappingService.deleteProductConfigMapping(productConfigMapping).subscribe(response => {

    //       console.log("Response - deleteProductConfigMapping : ", response);
    //       this.notificationService.success("Deleted successfully");
    //       this.loadProductConfigMappingsPage();
          
    //     }, error => {
    
    //       this.notificationService.failure(error.error);
    //     });
    //   }
    // });
  }

  


}
