import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSort, MatPaginator, MatIconRegistry } from '@angular/material';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import moment from 'moment-timezone';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';

@Component({
  
  selector: 'app-builder-configuration-home-page',
  templateUrl: './builder-configuration-home-page.component.html',
  styleUrls: ['./builder-configuration-home-page.component.css'],
})

export class BuilderConfigurationHomePageComponent implements OnInit, AfterViewInit {

  page = "1";
  pageSize = "100";
  sortBy = "modified_date";
  sortOrder = "desc";

  configurationTabList: any = [];
  newConfigurationPlatformsList: any = [];
  configurationList: any = [];
  configurationContextMenuList: any = [];

  showConfigurationList = false;
  selectedCustomerid;
  selectedCustomerName;

  public displayedColumns = ['name', 'c_date', 'm_date', 'details'];
  public dataSource = new MatTableDataSource<Owner>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public apiService:ApiService, private appComp: AppComponent, private router: Router, 
    private route: ActivatedRoute, private location: Location,  public dialog: MatDialog, public iconRegistry: MatIconRegistry, 
    public sanitizer: DomSanitizer, private excelExportService: IgxExcelExporterService) {

    this.apiService.showheader();

    this.selectedCustomerid = localStorage.getItem('selectedCustomerid');
    this.selectedCustomerName = localStorage.getItem('selectedCustomerName');
  }

  ngOnInit() {

    this.appComp.hide();
    this.appComp.toggleRightSidenav();

    this.configurationTabList = [{name : 'NEW'}, {name : 'SAVED'}];
    console.log('ngOnInit configurationTabList: ', this.configurationTabList);
  
    this.showConfigurationList = true;

    this.configurationContextMenuList = [{name: 'View/Modify'}, {name: 'Make a copy'}, {name: 'Delete'}];
    
    // this.apiService.getPlatforms().subscribe(response => {

    //   console.log("Response - newConfigurationPlatformsList: ", response);
    //   this.newConfigurationPlatformsList = JSON.parse(JSON.stringify(response));
    //   console.log("Response - newConfigurationPlatformsList: json: ", this.newConfigurationPlatformsList);
    // }, error => {

    // });

    this.apiService.getBuilderPlatforms().subscribe(response => {

      console.log("Response - newConfigurationPlatformsList: ", response);
      this.newConfigurationPlatformsList = JSON.parse(JSON.stringify(response));
      console.log("Response - newConfigurationPlatformsList: json: ", this.newConfigurationPlatformsList);
    }, error => {

    });

    this.apiService.getConfiguration(this.selectedCustomerid, this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe(response => {

      this.configurationList = JSON.parse(JSON.stringify(response)).items;

      if (this.configurationList.length > 0) {

        this.showConfigurationList = true;
        console.log('success');
      } else {

        console.log('failed');
        this.showConfigurationList = false;
      }
      console.log("Response - getConfiguration: ", this.configurationList);
      this.dataSource.data = this.configurationList as Owner[];
     console.log('this.dataSource.data', this.dataSource.data);
    }, error => {

    });
  }

  ngAfterViewInit(): void {

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  public doFilter = (value: string) => {

    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  getSelectedTabPosition(tabPosition) {

    console.log('getSelectedTabPosition tabPosition: ', tabPosition);
  }

  ViewMenuItemClick(configurationItem) {

    console.log("ViewMenuItemClick",configurationItem);
    console.log("ViewMenuItemClick",configurationItem.is_nso);
    
    if(configurationItem.is_nso == true) {

      localStorage.setItem("ShowLocalNSOConfig", "0");
      localStorage.setItem("BuilderSVGImage", configurationItem.svg_image);
      localStorage.setItem("IsFromSystemID", "false");
      this.router.navigate(['../nso-configuration'],{ relativeTo: this.route ,queryParams: { id: configurationItem.id }});
    } else {

      localStorage.setItem("AuditSVGImage", configurationItem.svg_image);
      localStorage.setItem("IsFromSystemID", "false");
      this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: configurationItem.id }});
    }
  }

  copyMenuItemClick(configurationItem) {


    this.apiService.copyConfiguration(configurationItem.id).subscribe(response => {

      console.log("Make a copy-Configuration",response);
      this.ngOnInit();
    });
  }

  DeleteMenuItemClick(configurationItem) {

    const dialogRef = this.dialog.open(DeleteDialog, {

      width: '370px',
      height: '150px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log('delete result', result);
      
      if (result == "YES") {

        this.apiService.deleteConfiguration(configurationItem.id).subscribe(response => {

          console.log('delete Configuration', response);

          this.apiService.getConfiguration(this.selectedCustomerid, this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe(response => {

            this.configurationList = JSON.parse(JSON.stringify(response)).items;
      
            if (this.configurationList.length > 0) {
      
              this.showConfigurationList = true;
              console.log('success');
            } else {
      
              console.log('failed');
              this.showConfigurationList = false;
            }
            console.log("Response - getConfiguration: ", this.configurationList);
            this.dataSource.data = this.configurationList as Owner[];
            console.log('this.dataSource.data', this.dataSource.data);
          }, error => {
      
          });
        });
      }
    });
  }

  onContextDeleteItemClick(i,configurationItem) {

  }

  onNewConfigurationSelection(platform) {

    console.log('onNewConfigurationSelection platformPosition: ', platform);
    localStorage.setItem("SelectedConfigPlatform", JSON.stringify(platform));
    localStorage.setItem("AuditSVGImage", platform.model_svg_url);
    localStorage.setItem("IsFromSystemID", "false");
    let configID = '';
    this.router.navigate(['../find-configuration'],{ relativeTo: this.route,queryParams: { id: configID } });
  }

  onEnterSystemIDButtonClick() {

    const dialogRef = this.dialog.open(EntersyStemIdDialog, {
      width: '450px',
      height: '360px'
    });

    dialogRef.afterClosed().subscribe(result => {

      const dailogSubmit = localStorage.getItem('submit');

      if (dailogSubmit) {

        let AuditSVGImage = localStorage.getItem('SelectedUserModelSVGURL');
        console.log("EntersyStemIdDialog - afterClosed AuditSVGImage: ", AuditSVGImage);
        
        localStorage.setItem("AuditSVGImage", AuditSVGImage);
        localStorage.setItem("IsFromSystemID", "true");
        this.router.navigate(['builder/find-configuration'], { queryParams: { id: localStorage.getItem('selectedUserConfigId') } });
      } else {

        dialogRef.close();
      }
    });
  }

  onUploadButtonClick() {

    // this.router.navigate(['../find-configuration'],{ relativeTo: this.route });
  }

  backButton() {
    
    this.router.navigate(['builder']);
    // this.location.back();
  }

  convertPSTTimeZone(serverTime) {

    // console.log('convertPSTTimeZone serverTime: ', serverTime);
    let momentTime = moment(serverTime);

    // console.log('convertPSTTimeZone America/Los_Angeles ha z: ', momentTime.tz('America/Los_Angeles').format('ha z'));
    // console.log('convertPSTTimeZone America/Los_Angeles: ', momentTime.tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ss.SSSSZ'));
    return momentTime.tz('America/Los_Angeles').format('MMM DD, YYYY hh:mm:ss A');
  }

  getPSTorPDT() {

    let momentTime = moment(new Date());

    // console.log('getPSTorPDT serverTime z: ', momentTime.tz('America/Los_Angeles').format('z'));
    return momentTime.tz('America/Los_Angeles').format('z');
  }

  public exportEmptyData() {

    this.apiService.getMasterEmptySystemIdConfigurations(this.selectedCustomerid).subscribe(response => {
          
      console.log("response-getMasterEmptySystemIdConfigurations ", response);
      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - platform excelData: ", excelData);
      
      if (excelData.length > 0) {

        this.excelExportService.exportData(excelData, new IgxExcelExporterOptions( this.selectedCustomerName + " - Empty Facets"));
      } else {

        let responseMsg = 'No empty facets available';
        const dialogRef = this.dialog.open(NoEmptyFacetsDialog, {
          width: '350px',
          height: 'auto',
          data: {message: responseMsg}
        });
      
        dialogRef.afterClosed().subscribe(result => {
      
        });
      }
    });
  }

  public exportAllData() {
    
    this.apiService.getMasterSystemIDsWithAllFacetsByCustomerID(this.selectedCustomerid).subscribe(response => {
          
      console.log("response-getMasterSystemIDsWithAllFacetsByCustomerID ", response);
      let excelData = JSON.parse(JSON.stringify(response));
      console.log("Response - excelData: ", excelData);
      
      this.excelExportService.exportData(excelData, new IgxExcelExporterOptions( this.selectedCustomerName + " - All Data"));
    });
  }
}

@Component({

  selector: 'dialogentersystemiddialog',
  templateUrl: 'enterSystemIdDialog.html',
  styleUrls: ['./enterSystemIdDialog.css'],
})

export class EntersyStemIdDialog implements OnInit {

  searchSystemIDDropDownList: any = [];
  getSystemIDList: any = [];
  searchSystemID;
  customerID;
  systemIDSubmitButtonEnable: boolean = false;
  fab_name;
  fabID;
  systemConfigID;
  errorMessageForNoConfiguration;

  @ViewChild('systemId') private _enterSystemId: ElementRef;
  
  sysidform = this.formBuilder.group({
    sysidsearchTerm: [null, [Validators.required]],
  });
 
  get sysidsearchTerm(): any {
    return this.sysidform.get('sysidsearchTerm');
  }
  
  constructor(public dialogRef: MatDialogRef<EntersyStemIdDialog>, private formBuilder: FormBuilder, 
    public apiService:ApiService, private router: Router, 
    private route: ActivatedRoute, private location: Location) {
  }

  ngOnInit() {
  
    this.sysidsearchTerm.reset();
    localStorage.removeItem('submit');
    console.log('locabutton', localStorage.getItem('submit'));

    this.customerID = localStorage.getItem('selectedCustomerid');
    console.log('ngOnInit customerID:', this.customerID);

    this.apiService.getMasterProjectNumbersByCustomerID(this.customerID).subscribe(response => {
      
      console.log('ngOnInit getMasterProjectNumbersByCustomerID: ', response);

      this.searchSystemIDDropDownList = JSON.parse(JSON.stringify(response));
      this.getSystemIDList = JSON.parse(JSON.stringify(response));
    });
  }

  systemIDSearchClear() {

    console.log('systemIDSearchClear');

    this.sysidsearchTerm.reset();
    this.systemIDSubmitButtonEnable = false;
    this.searchSystemIDDropDownList = this.getSystemIDList;
  }

  SysidDialogClose() {

    this.dialogRef.close();
  }

  searchSystemIDClick(searchSystemID) {

    console.log('searchSystemIDClick searchSystemID ', searchSystemID);

    this.systemIDSubmitButtonEnable = true;
    
    this.systemConfigID = searchSystemID.project_number;
    this.fab_name = searchSystemID.project_number + ' (' + searchSystemID.fab_name + ')';
    this.fabID = searchSystemID.id;

    console.log('searchSystemIDClick systemConfigID ', this.systemConfigID);
    console.log('searchSystemIDClick fab_name ', this.fab_name);
    console.log('searchSystemIDClick fabID ', this.fabID);

    localStorage.setItem("selectedUserConfigId", searchSystemID.project_number); 
    localStorage.setItem("selectedUserBySystemID", JSON.stringify(searchSystemID)); 
    localStorage.setItem("SelectedUserModelSVGURL", searchSystemID.model_svg_url);
    localStorage.setItem("selectedFabID", searchSystemID.fab_id);
    localStorage.setItem("selectedProjectNoID", searchSystemID.id);
  }

  onSystemIDSearchKeyUp(event: any) {

    console.log('onSystemIDSearchKeyUp event ', event.target.value);
    console.log('onSystemIDSearchKeyUp getSystemIDList ', this.getSystemIDList);

    localStorage.removeItem('submit');
    
    this.searchSystemIDDropDownList = this.systemIDfilterKeyPressedValue(event.target.value, this.getSystemIDList);
    this.systemIDSubmitButtonEnable = false;
  }
     
  systemIDfilterKeyPressedValue(searchValue, systemIDList) {
       
    console.log('systemIDfilterKeyPressedValue searchValue ', searchValue);
    console.log('systemIDfilterKeyPressedValue systemIDList ', systemIDList);

    var msearchSystemIDDropDownList: any[] = [];

    for (var i = 0; i < systemIDList.length; i++) {
      
      if (systemIDList[i].fab_name.toLowerCase().includes(searchValue.toLowerCase()) || systemIDList[i].project_number.toLowerCase().includes(searchValue.toLowerCase())) {

        msearchSystemIDDropDownList.push(systemIDList[i]);
      }
    }

    console.log('systemIDfilterKeyPressedValue msearchSystemIDDropDownList: ', msearchSystemIDDropDownList);

    return msearchSystemIDDropDownList;
  }

  submit() {
    
    if(this.systemConfigID) {
      
      this.dialogRef.close();
      localStorage.setItem('submit', 'true');
      console.log('localsubmitbutton', localStorage.getItem('submit'));
    } else {

      this.errorMessageForNoConfiguration = " Note: You have no such existing configuration";
    }
  }
}

@Component({

  selector: 'deletedialog',
  templateUrl: 'deleteDialog.html',
  styleUrls: ['./deleteDialog.css'],
})

export class DeleteDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit() {
  }

  DeleteDialogClose() {

    this.dialogRef.close();
  }

  Delete() {

    this.dialogRef.close("YES");
  }
}

export interface Owner{

  config_id: string;
  name: string;
  c_date: string;
  created_by_name: string;
  m_date: string;
  modified_by_name: string;
}

export interface DialogData {

  deleteItem;
}

@Component({

  selector: 'no-empty-facets-dialog',
  templateUrl: 'NoEmptyFacetsDialog.html',
})

export class NoEmptyFacetsDialog {

  constructor(public dialogRef: MatDialogRef<NoEmptyFacetsDialog>, @Inject(MAT_DIALOG_DATA) public data: EmptyFacetstData) { }

  dialogOK() {
    
    this.dialogRef.close();
  }
}

export interface EmptyFacetstData {

  message: string;
}
