import { MatSnackBar } from '@angular/material/snack-bar';
import { style } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { MatIconRegistry, MatSelect, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogData } from '../../Analytics/AnalyticsCustomersPage/analytics-customers-page.component';

@Component({
  
  selector: 'app-builder-find-configuration-page',
  templateUrl: './builder-find-configuration-page.component.html',
  styleUrls: ['./builder-find-configuration-page.component.css'],
})

export class BuilderFindConfigurationPageComponent implements OnInit {

  page = "1";
  pageSize = "1";
  sortBy = "name";
  sortOrder = "asc";
  filterTerms = "";

  selectedConfigPlatform:any = {};
  configFecets:any = [];
  builderConfigFecets:any = [];
  explorerChambersFamily:any = [];
  searchExplorerChambersList:any = [];
  svgColorArray: Array<ColorModel> = [];
  svgDummyColorCodes: any[] = [];
  chambersByFamilyID:any = [];
  // finalConfigurationArray:any = [];
  selectedSavedConfiguration:any = [];

  imageURL: string = '';
  isSVGImageHidden = true;

  selectedChamberID;
  selectedChamberFamilyID;
  selectedChamberGotCode;

  domIDsList;
  selectedChamberPosition;
  chamberTitle;
  SelectedChamberName;
  selectedChamberIndexPosition;
  chamberListMouseoverPosition;
  selectedFecetName;
  selectedChamberFamilyName;
  configID;

  selectedCustomerid;
  selectedConfigID;
  selectedFabID;
  selectedProjectNoID;

  isBackArrowVisible:boolean = false;
  hideNavDrawerSearch = false;
  hideNavDrawerChamberDescription = true;
  isEnableCheckMark:boolean = false
  isHoverCheckMark:boolean = false;

  spinnerValue = 0;
  interval;
  timeLeft: number = 0;
  spinnerMode = "determinate";

  isEditHeader = false;
  headerTitle = "";

  isFromSystemID = 'false';
  isEditableTitle = false;

  isSelectedABPositions = false;
  chambersForAB: any = [];

  headerPlatformName = "";

  @ViewChild('configTitle') configTitle:ElementRef;
  @ViewChild('sideNavSearchInput') sideNavSearchInput:ElementRef;
  // @ViewChild("myInput") private inputValue: ElementRef;
  @ViewChild('findChmberSearchInput') private findChmberSearchInput: ElementRef;
  @ViewChild('selectChamberFamilyDropdown') chamberFamilyselectDropdown: MatSelect;

  findChamberForm = this.formBuilder.group({
    
    findChamberFormControl: [null, [Validators.required]],
  });
 
  get findChamberFormControl(): any {

    return this.findChamberForm.get('findChamberFormControl');
  }

  constructor(public apiService:ApiService, private appComp: AppComponent,private location:Location,private formBuilder: FormBuilder,private router: Router, 
    private route: ActivatedRoute,public iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer, private elem: ElementRef,public toastMessage: MatSnackBar,  public dialog: MatDialog) {

    this.apiService.showheader();

    this.selectedConfigPlatform = JSON.parse(localStorage.getItem('SelectedConfigPlatform'));
    console.log("local storage-SelectedConfigPlatform",this.selectedConfigPlatform);

    this.selectedCustomerid = localStorage.getItem('selectedCustomerid');
    console.log("selectedCustomerid",this.selectedCustomerid);

    this.selectedFabID = localStorage.getItem('selectedFabID');
    console.log("selectedFabID",this.selectedFabID);

    this.selectedProjectNoID = localStorage.getItem('selectedProjectNoID');
    console.log("selectedProjectNoID",this.selectedProjectNoID);
    
    this.isFromSystemID = localStorage.getItem('IsFromSystemID');
    console.log("IsFromSystemID",this.isFromSystemID);

    this.svgDummyColorCodes = [

      {"ColorCode": "#4B9DB7"}, {"ColorCode": "#546FA6"}, {"ColorCode": "#223884"}, {"ColorCode": "#00B5E2"}, {"ColorCode": "#99D6EA"},
      {"ColorCode": "#007576"}, {"ColorCode": "#83C447"}, {"ColorCode": "#235723"}, {"ColorCode": "#2A8A60"}, {"ColorCode": "#4BD9B7"},
      {"ColorCode": "#546AF6"}
    ];

    this.route.queryParams.subscribe(params => {

      console.log("queryParams-id",params['id']);
      this.configID = params['id'];
    });

    this.imageURL = localStorage.getItem('AuditSVGImage');
    // this.imageURL = "assets/ENDURANocircle.svg";
    // this.imageURL = "assets/SingleProducer2NoCircle.svg";
    // this.imageURL = "assets/ENDURANocircleP4.svg";
    // this.imageURL = "assets/Centura2NoCircle.svg";
    // this.imageURL = "assets/Charger2NoCircle.svg";
    // this.imageURL = "assets/CHARGER2LinkNoCircle.svg";
    console.log("local storage-AuditSVGImage", this.imageURL);
    this.iconRegistry.addSvgIcon('productImageIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));

    this.startSpinnerUpdateTimer();
    
    setTimeout(()=> {

      this.loadSvgImage();
    }, 5000);


    if (this.configID == '') {

      console.log("configID",this.configID);

      // this.configTitle.nativeElement.value = "Untitled";
      this.headerTitle = "Untitled";
      this.isEditHeader = false;

      this.headerPlatformName = this.selectedConfigPlatform.name;

      this.apiService.getBuilderFacets(this.selectedConfigPlatform.id).subscribe(response => {

        console.log("Response - getBuilderFacets: ", response);

        this.configFecets = JSON.parse(JSON.stringify(response));
        console.log("Response - configFecets: ", this.configFecets);

        for(var i = 0; i < this.configFecets.items.length; i++) {

          this.builderConfigFecets.push({
            facet_name:this.configFecets.items[i].name,
            chamber_name:"",
            chamber_family_name:"",
            config_id:"",
            id:"",
            chamber_id:"0",
            chamber_family_id:"0",
            got_code: ""
          });
        }
      }, error => {

      });
    } else {

      if (this.isFromSystemID == "false") {

        this.isEditableTitle = false;

        console.log("configID else", this.configID);

        let savedConfigurationResponse:any = [];
        let savedConfigurationArray:any = [];
  
        this.apiService.getConfigurationDetails(this.configID).subscribe(response => {
      
          console.log("getConfigurationDetail response", response);
  
          savedConfigurationResponse = JSON.parse(JSON.stringify(response));
          console.log("getConfigurationDetails savedConfigurationResponse", savedConfigurationResponse);
  
          savedConfigurationArray = savedConfigurationResponse.configuration;
          console.log("getConfigurationDetails savedConfigurationArray", savedConfigurationArray);
          
          // this.configTitle.nativeElement.value = savedConfigurationResponse.name;
          this.headerTitle = savedConfigurationResponse.name;
          this.isEditHeader = false;
          this.headerPlatformName = savedConfigurationResponse.platform_family_name;
          
          this.selectedConfigPlatform = {};
          this.selectedConfigPlatform.id = savedConfigurationResponse.platform_family_id;
                  
          for(var i = 0; i < savedConfigurationArray.length; i++) {
  
            this.builderConfigFecets.push({
              facet_name:savedConfigurationArray[i].facet_name,
              chamber_name:savedConfigurationArray[i].chamber_name,
              chamber_family_name:savedConfigurationArray[i].chamber_family_name,
              config_id:savedConfigurationArray[i].config_id,
              id:savedConfigurationArray[i].id,
              chamber_id:savedConfigurationArray[i].chamber_id,
              chamber_family_id:savedConfigurationArray[i].chamber_family_id,
              got_code: savedConfigurationArray[i].gotCode
            });
          }
      
          for( var i = 0; i < this.builderConfigFecets.length; i++) {
  
            if (this.builderConfigFecets[i].chamber_name === '') {
  
              this.isEnableCheckMark = false;
            } else {
  
              this.isEnableCheckMark = true;
              return;
            }
          }
        });
      } else {

        this.isEditableTitle = true;

        let savedConfigurationResponse:any = [];
        let savedConfigurationArray:any = [];

        console.log("getMasterSystemIdConfigurations configurationID", this.configID);
        console.log("getMasterSystemIdConfigurations selectedCustomerid", this.selectedCustomerid);
        console.log("getMasterSystemIdConfigurations selectedFabID", this.selectedFabID);
        console.log("getMasterSystemIdConfigurations selectedProjectNoID", this.selectedProjectNoID);
        
        this.apiService.getMasterSystemIdConfigurations(this.configID, this.selectedCustomerid, this.selectedFabID, this.selectedProjectNoID).subscribe(response => {
      
          console.log("getMasterSystemIdConfigurations response", response);
  
          savedConfigurationResponse = JSON.parse(JSON.stringify(response));
          console.log("getMasterSystemIdConfigurations savedConfigurationResponse", savedConfigurationResponse);
  
          savedConfigurationArray = savedConfigurationResponse.configuration;
          console.log("getMasterSystemIdConfigurations savedConfigurationArray", savedConfigurationArray);
          
          // this.configTitle.nativeElement.value = savedConfigurationResponse.name;
          this.headerTitle = savedConfigurationResponse.name;
          this.isEditHeader = false;
          this.headerPlatformName = savedConfigurationResponse.platform_family_name;
          
          this.selectedConfigPlatform = {};
          this.selectedConfigPlatform.id = savedConfigurationResponse.platform_family_id;
                  
          for(var i = 0; i < savedConfigurationArray.length; i++) {
  
            this.builderConfigFecets.push({
              facet_name:savedConfigurationArray[i].facet_name,
              chamber_name:savedConfigurationArray[i].chamber_name,
              chamber_family_name:savedConfigurationArray[i].chamber_family_name,
              config_id:savedConfigurationArray[i].config_id,
              id:savedConfigurationArray[i].id,
              chamber_id:savedConfigurationArray[i].chamber_id,
              chamber_family_id:savedConfigurationArray[i].chamber_family_id,
              got_code: savedConfigurationArray[i].gotCode
            });
          }
      
          for( var i = 0; i < this.builderConfigFecets.length; i++) {
  
            if (this.builderConfigFecets[i].chamber_name === '') {
  
              this.isEnableCheckMark = false;
            } else {
  
              this.isEnableCheckMark = true;
              return;
            }
          }
        });
      }
    }
  }

  startSpinnerUpdateTimer() {

    this.interval = setInterval(() => {

      console.log("startSpinnerUpdateTimer setInterval timeLeft: ", this.timeLeft);
      if(this.timeLeft == 5) {
        clearInterval(this.interval);
      } else {
        this.timeLeft++;
        this.spinnerValue = this.timeLeft * 20;
        console.log("startSpinnerUpdateTimer spinnerValue: ", this.spinnerValue);
      }
    },1000);
  }

  ngOnInit() {
    
    console.log("ngOnInit-configID",this.configID);

    this.findChamberFormControl.reset();
    this.appComp.hide();
    this.appComp.toggleRightSidenav();

    this.route.queryParams.subscribe(params => {

      console.log("queryParams-id",params['id']);
      this.configID = params['id'];
    });
  }

  // ngAfterContentChecked() {

  //   this.domIDsList = document.querySelector('object').ownerDocument.documentElement.querySelectorAll('g');
  //   this.loadSvgImage();
  // }

  editHeaderClick() {

    this.isEditHeader = true;

    setTimeout(()=>{
      this.configTitle.nativeElement.focus();
    },0);  
  }

  outEditNSOHeaderfocus() {

    this.isEditHeader = false;
  }

  loadSvgImage() {

    let dummySVGColorArray = [];

    setTimeout(()=> {

      this.domIDsList = document.querySelector('object').ownerDocument.documentElement.querySelectorAll('g');
      console.log("domIDsList",this.domIDsList);

      if (this.domIDsList.length > 0) {

        this.isSVGImageHidden = false;
        
        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          if(this.builderConfigFecets[i].chamber_name == '') {
    
            for(var j = 0; j < this.domIDsList.length; j++) {
              
              if(this.domIDsList[j].id === this.builderConfigFecets[i].facet_name + '-ACTIVE') {

                this.domIDsList[j].childNodes[1].style.fill = 'gray';
              } else {

              }
            }
          } else {

            let colorModel = new ColorModel();
            colorModel.productName = this.builderConfigFecets[i].chamber_name;
            colorModel.productColor = this.svgDummyColorCodes[i].ColorCode;
            dummySVGColorArray.push(colorModel);
          }
          this.isSVGImageHidden = false;
        }

        for(let i = 0; i < dummySVGColorArray.length; i++) {

          this.checkDiplicateSVGColors(dummySVGColorArray[i]);
        }

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          if(this.builderConfigFecets[i].chamber_name == '') {

          } else {

            for(var j = 0; j < this.svgColorArray.length; j++) {

              if(this.builderConfigFecets[i].chamber_name == this.svgColorArray[j].productName) {
              
                for(var k = 0; k < this.domIDsList.length; k++) {
              
                  if(this.domIDsList[k].id === this.builderConfigFecets[i].facet_name + '-ACTIVE') {

                    this.domIDsList[k].childNodes[1].style.fill = this.svgColorArray[j].productColor;
                  } else {
                  }
                }
              }
            }
          }
        }
      } else {
        
        this.loadSvgImage();
      }
    }, 1000);
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  onKeyUp(event) {

    console.log("onKeyUp builderConfigFecets", this.builderConfigFecets);
    
    if(this.configID == '') {

    } else {

      let finalConfigurationArray:any = [];

      for(var i = 0; i < this.builderConfigFecets.length; i++) {

        finalConfigurationArray.push({
          config_id:this.builderConfigFecets[i].config_id,
          chamber_family_id:this.builderConfigFecets[i].hamber_family_id,
          chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
          chamber_id:this.builderConfigFecets[i].chamber_id,
          chamber_name:this.builderConfigFecets[i].chamber_name,
          facet_name:this.builderConfigFecets[i].facet_name,
          id:this.builderConfigFecets[i].id,
        });
      }

      console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);

      this.apiService.updateConfiguration(this.headerTitle, this.configID, this.selectedCustomerid, finalConfigurationArray).subscribe(response => {

        console.log("updateConfiguration response: ", response);

        let responseMsg = JSON.parse(JSON.stringify(response)).message;
        console.log("updateConfiguration responseMsg: ", responseMsg);
        
        if (responseMsg == "success") {

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {
            
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        } else {

          const dialogRef = this.dialog.open(ConfigTitleExitDialog, {
            width: '350px',
            height: 'auto',
            data: {message: responseMsg}
          });
        
          dialogRef.afterClosed().subscribe(result => {
        
          });
        }
      }, error => {
      });
    }
  }

  goToPreviousPage() {

    console.log("goToPreviousPage builderConfigFecets", this.builderConfigFecets);

    localStorage.removeItem("selectedSavedCofiguration");
    this.router.navigate(['builder/configuration']);
    // this.location.back();
  }

  closeNavigationDrawer() {

    document.getElementById("sidenavDrawer").style.width = "0%";
  }

  addChamber(fecets, index) {

    this.selectedChamberIndexPosition = index;
    this.selectedFecetName = fecets.facet_name;
    document.getElementById("sidenavDrawer").style.width = "100%";
    console.log("fecets",fecets,this.selectedChamberPosition);

    console.log("addChamber selectedFecetName: ", this.selectedFecetName);

    if ((this.selectedFecetName == "A" || this.selectedFecetName == "B")
      && (this.selectedConfigPlatform.id == 1 || this.selectedConfigPlatform.id == 3 || this.selectedConfigPlatform.id == 4
         || this.selectedConfigPlatform.id == 8 || this.selectedConfigPlatform.id == 9)) {

      this.isSelectedABPositions = true;
    } else {

      this.isSelectedABPositions = false;
    }

    this.explorerChambersFamily = [];
    this.chambersByFamilyID = [];

    this.findChamberFormControl.reset();
    this.chamberFamilyselectDropdown.value = [];
    this.findChmberSearchInput.nativeElement.value = '';

    this.apiService.getExplorerChamberFamilies(this.selectedConfigPlatform.id, this.selectedFecetName).subscribe(response => {

      this.explorerChambersFamily = JSON.parse(JSON.stringify(response));
      console.log("getExplorerChamberFamilies Response - explorerChambersFamily: ", this.explorerChambersFamily);
    }, error => {

    });
  }

  onSearchKeyUp(event) {

    if(event.target.value == "" ) {

      this.searchExplorerChambersList = [];
    }else {

      this.filterTerms = event.target.value;
      console.log("event",event.target.value);
      this.apiService.getSearchBuilderChambers(this.filterTerms, this.page, this.pageSize, this.sortBy, this.sortOrder, this.selectedConfigPlatform.id).subscribe(response => {
  
        this.searchExplorerChambersList = JSON.parse(JSON.stringify(response));
        console.log("Response - getSearchBuilderChambers searchExplorerChambersList: ", this.searchExplorerChambersList);
      }, error => {
  
      });
    }
  }

  chamberListItemMouseover(index) {

    this.chamberListMouseoverPosition = index;
  }

  chamberListItemMouseLeave() {

    this.chamberListMouseoverPosition = -1;
  }

  getSVGItemColor(chamber_name) {

    for(var i = 0; i < this.svgColorArray.length; i++) {

      if(chamber_name === this.svgColorArray[i].productName) {

        return this.svgColorArray[i].productColor;
      }
    }
  }

  checkDiplicateSVGColors(svgColorItem) {

    for (let i = 0; i < this.svgColorArray.length; i++) {

      if(this.svgColorArray[i].productName === svgColorItem.productName) {

          return;
      }
    }
    this.svgColorArray.push(svgColorItem);
  }

  selectedChamberFamilityItem(family) {

    // this.selectedChamberFamilyName = family.name;
    this.selectedChamberFamilyID = family.id;

    for( var i = 0; i < this.builderConfigFecets.length; i++) {

      if (i == this.selectedChamberIndexPosition) {

        this.builderConfigFecets[i].chamber_family_name = family.name;
        this.builderConfigFecets[i].chamber_family_id = family.id;
      }
    }

    this.findChamberForm.controls['findChamberFormControl'].setValue(null);

    this.apiService.getChambersByFamilyID(family.id).subscribe(response => {

      this.chambersByFamilyID = JSON.parse(JSON.stringify(response));
      console.log("Response - chambersByFamilyID: ", this.chambersByFamilyID);
    }, error => {

    });
  }

  selectedChamberItem(chamber) {

    console.log("chamber",chamber);
    this.SelectedChamberName = chamber.name;
    this.selectedChamberID = chamber.id;
    this.selectedChamberGotCode = chamber.gotCode;

    console.log("selectedChamberItem-builderConfigFecets",this.builderConfigFecets);
  }

  selectedChamberABItem(chamber) {

    console.log("chamber",chamber);
    this.SelectedChamberName = chamber.name;
    this.selectedChamberID = "0";
    this.selectedChamberGotCode = chamber.gotCode;

    this.selectedChamberFamilyName = "";
    this.selectedChamberFamilyID = "";

    console.log("selectedChamberABItem-builderConfigFecets",this.builderConfigFecets);
  }

  submit() {

    console.log("submit-submit-builderConfigFecets",this.builderConfigFecets);

    for( var i = 0; i < this.builderConfigFecets.length; i++) {

      if (i == this.selectedChamberIndexPosition) {

        this.builderConfigFecets[i].chamber_name = this.SelectedChamberName;
        this.builderConfigFecets[i].chamber_id = this.selectedChamberID;
        this.builderConfigFecets[i].got_code = this.selectedChamberGotCode;
      }
    }

    console.log("final selectedFecet",this.builderConfigFecets);

    this.chambersByFamilyID = [];
    this.explorerChambersFamily = [];
    this.isEnableCheckMark = true;

    this.closeNavigationDrawer();

    this.loadSvgImage();

    this.findChamberFormControl.reset();
    this.chamberFamilyselectDropdown.value = [];
    this.findChmberSearchInput.nativeElement.value = '';

    console.log("Response -sending to sevice builderConfigFecets", this.builderConfigFecets);

    if(this.configID == '') {

      let finalConfigurationArray:any = [];

      for(var i = 0; i < this.builderConfigFecets.length; i++) {

        finalConfigurationArray.push({
          facet_name:this.builderConfigFecets[i].facet_name,
          chamber_name:this.builderConfigFecets[i].chamber_name,
          chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
          chamber_id:this.builderConfigFecets[i].chamber_id,
          chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
          // got_code: this.builderConfigFecets[i].got_code,
        });
      }

      console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);

      this.apiService.addConfiguration(this.headerTitle, this.selectedCustomerid, this.selectedConfigPlatform.id, finalConfigurationArray).subscribe(response => {
      
        console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));

        this.configID = String(JSON.parse(JSON.stringify(response)).ConfigID);
        this.headerTitle = String(JSON.parse(JSON.stringify(response)).config_name);

        this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: this.configID }});
        let configurationArray:any = [];

        configurationArray = JSON.parse(JSON.stringify(response)).configuration;
        console.log("Response - configurationArray: ", configurationArray);

          // this.builderConfigFecets = [];
        for(var i = 0; i < configurationArray.length; i++){

          for (var j = 0; j < this.builderConfigFecets.length; j++) {

            if (configurationArray[i].facet_name == this.builderConfigFecets[j].facet_name) {

              this.builderConfigFecets[j].chamber_name = configurationArray[i].chamber_name;
              this.builderConfigFecets[j].config_id = configurationArray[i].config_id;
              this.builderConfigFecets[j].id = configurationArray[i].id;
              this.builderConfigFecets[j].chamber_family_name = configurationArray[i].chamber_family_name;
              this.builderConfigFecets[j].got_code = configurationArray[i].gotCode;
            }
          }
        }

        console.log("after configuration ", this.builderConfigFecets);

        let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

        this.toastMessage.open(message,'', {
          
          panelClass: ['toastStyles'],
          duration: 2000,
        });
      }, error => {
  
      });
    } else {

      if (this.isFromSystemID == "false") {

        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          finalConfigurationArray.push({
            config_id:this.builderConfigFecets[i].config_id,
            chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
            chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
            chamber_id:this.builderConfigFecets[i].chamber_id,
            chamber_name:this.builderConfigFecets[i].chamber_name,
            facet_name:this.builderConfigFecets[i].facet_name,
            id:this.builderConfigFecets[i].id,
          });
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);

        console.log("update();", finalConfigurationArray);
        console.log("update();",this.configID);

        this.apiService.updateConfiguration(this.headerTitle, this.configID, this.selectedCustomerid, finalConfigurationArray).subscribe(response => {

          console.log("Response - updateConfiguration: ", response);

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {
            
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {
    
        });
      } else {
        
        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          finalConfigurationArray.push({
            facet_name:this.builderConfigFecets[i].facet_name,
            chamber_name:this.builderConfigFecets[i].chamber_name,
            chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
            chamber_id:this.builderConfigFecets[i].chamber_id,
            chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
            // got_code: this.builderConfigFecets[i].got_code,
          });
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);
        console.log("Response -sending to sevice finalConfigurationArray", this.selectedConfigPlatform.id);
        
        let headerTitle = this.headerTitle + " BP Rev-1"
        this.apiService.addConfiguration(headerTitle, this.selectedCustomerid, this.selectedConfigPlatform.id, finalConfigurationArray).subscribe(response => {
        
          console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));

          this.configID = String(JSON.parse(JSON.stringify(response)).ConfigID);
          this.headerTitle = String(JSON.parse(JSON.stringify(response)).config_name);

          this.isFromSystemID = "false";
          localStorage.setItem("IsFromSystemID", "false");

          this.isEditableTitle = false;

          this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: this.configID }});
          let configurationArray:any = [];

          configurationArray = JSON.parse(JSON.stringify(response)).configuration;
          console.log("Response - configurationArray: ", configurationArray);

            // this.builderConfigFecets = [];
          for(var i = 0; i < configurationArray.length; i++){

            for (var j = 0; j < this.builderConfigFecets.length; j++) {

              if (configurationArray[i].facet_name == this.builderConfigFecets[j].facet_name) {

                this.builderConfigFecets[j].chamber_name = configurationArray[i].chamber_name;
                this.builderConfigFecets[j].config_id = configurationArray[i].config_id;
                this.builderConfigFecets[j].id = configurationArray[i].id;
                this.builderConfigFecets[j].chamber_family_name = configurationArray[i].chamber_family_name;
                this.builderConfigFecets[j].got_code = configurationArray[i].gotCode;
              }
            }
          }

          console.log("after configuration ", this.builderConfigFecets);

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {
            
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {
    
        });
      }
    }
  }

  findChmberSearchClear() {

    this.searchExplorerChambersList = [];
    this.findChmberSearchInput.nativeElement.value = '';
  }

  searchExplorerChamberClick(searchExplorerChamber) {

    console.log('searchExplorerChamberClick:', searchExplorerChamber);

    for( var i = 0; i < this.builderConfigFecets.length; i++) {

      if (i == this.selectedChamberIndexPosition) {

        this.builderConfigFecets[i].chamber_name = searchExplorerChamber.chamber_name;
        this.builderConfigFecets[i].chamber_family_name = searchExplorerChamber.chamber_family_name;

        this.builderConfigFecets[i].chamber_id = searchExplorerChamber.chamber_id;
        this.builderConfigFecets[i].chamber_family_id = searchExplorerChamber.chamber_family_id;

        this.builderConfigFecets[i].got_code = searchExplorerChamber.got_code;
      }
      console.log("final selectedFecet",this.builderConfigFecets);
    }

    this.closeNavigationDrawer();
    this.loadSvgImage();

    this.findChamberFormControl.reset();
    this.chamberFamilyselectDropdown.value = [];
    this.findChmberSearchInput.nativeElement.value = '';
    this.searchExplorerChambersList = [];
    this.isEnableCheckMark = true;

    let finalConfigurationArray:any = [];

    for(var i = 0; i < this.builderConfigFecets.length; i++) {

      finalConfigurationArray.push({
        facet_name:this.builderConfigFecets[i].facet_name,
        chamber_name:this.builderConfigFecets[i].chamber_name,
        chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
        chamber_id:this.builderConfigFecets[i].chamber_id,
        chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
      });
    }

    console.log("searchExplorerChamberClick finalConfigurationArray",finalConfigurationArray);

    if(this.configID == "") {

      this.apiService.addConfiguration(this.headerTitle,this.selectedCustomerid,this.selectedConfigPlatform.id,finalConfigurationArray).subscribe(response => {
     
        console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));
        this.configID = String(JSON.parse(JSON.stringify(response)).ConfigID);
        this.headerTitle = String(JSON.parse(JSON.stringify(response)).config_name);

        this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: this.configID }});
        let configurationArray:any = [];

        configurationArray = JSON.parse(JSON.stringify(response)).configuration;
        console.log("Response - configurationArray: ", configurationArray);

        // this.builderConfigFecets = [];
        for(var i = 0; i < configurationArray.length; i++) {

          for (var j = 0; j < this.builderConfigFecets.length; j++) {

            if (configurationArray[i].facet_name == this.builderConfigFecets[j].facet_name) {

              this.builderConfigFecets[j].chamber_name = configurationArray[i].chamber_name;
              this.builderConfigFecets[j].config_id = configurationArray[i].config_id;
              this.builderConfigFecets[j].id = configurationArray[i].id;
              this.builderConfigFecets[j].chamber_family_name = configurationArray[i].chamber_family_name;
              this.builderConfigFecets[j].chamber_id = configurationArray[i].chamber_id;
              this.builderConfigFecets[j].chamber_family_id = configurationArray[i].chamber_family_id;
              this.builderConfigFecets[j].got_code = configurationArray[i].gotCode;
            }
          }
        }

        let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

        this.toastMessage.open(message,'', {

          panelClass: ['toastStyles'],
          duration: 2000,
        });
      }, error => {

      });
    } else {

      if (this.isFromSystemID == "false") {

        console.log("searchExplorerChamberClick-update();",this.builderConfigFecets);

        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          finalConfigurationArray.push({
            config_id:this.builderConfigFecets[i].config_id,
            chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
            chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
            chamber_id:this.builderConfigFecets[i].chamber_id,
            chamber_name:this.builderConfigFecets[i].chamber_name,
            facet_name:this.builderConfigFecets[i].facet_name,
            id:this.builderConfigFecets[i].id,
          });
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);

        this.apiService.updateConfiguration(this.headerTitle, this.configID, this.selectedCustomerid, finalConfigurationArray).subscribe(response => {
          console.log("searchExplorerChamberClick-Response - updateConfiguration: ", response);

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {

            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {

        });
      } else {
        
        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          finalConfigurationArray.push({
            facet_name:this.builderConfigFecets[i].facet_name,
            chamber_name:this.builderConfigFecets[i].chamber_name,
            chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
            chamber_id:this.builderConfigFecets[i].chamber_id,
            chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
            // got_code: this.builderConfigFecets[i].got_code,
          });
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);
        
        let headerTitle = this.headerTitle + " BP Rev-1"
        this.apiService.addConfiguration(headerTitle, this.selectedCustomerid, this.selectedConfigPlatform.id, finalConfigurationArray).subscribe(response => {
        
          console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));

          this.configID = String(JSON.parse(JSON.stringify(response)).ConfigID);
          this.headerTitle = String(JSON.parse(JSON.stringify(response)).config_name);

          this.isFromSystemID = "false";
          localStorage.setItem("IsFromSystemID", "false");

          this.isEditableTitle = false;

          this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: this.configID }});
          let configurationArray:any = [];

          configurationArray = JSON.parse(JSON.stringify(response)).configuration;
          console.log("Response - configurationArray: ", configurationArray);

            // this.builderConfigFecets = [];
          for(var i = 0; i < configurationArray.length; i++){

            for (var j = 0; j < this.builderConfigFecets.length; j++) {

              if (configurationArray[i].facet_name == this.builderConfigFecets[j].facet_name) {

                this.builderConfigFecets[j].chamber_name = configurationArray[i].chamber_name;
                this.builderConfigFecets[j].config_id = configurationArray[i].config_id;
                this.builderConfigFecets[j].id = configurationArray[i].id;
                this.builderConfigFecets[j].chamber_family_name = configurationArray[i].chamber_family_name;
                this.builderConfigFecets[j].got_code = configurationArray[i].gotCode;
              }
            }
          }

          console.log("after configuration ", this.builderConfigFecets);

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {
            
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {
    
        });
      }
    }
  }

  deleteChamber(index) {

    let isBuilderConfigEmpty = false;
    let builderConfigFecet = [];

    for( var i = 0; i < this.builderConfigFecets.length; i++) {

      if(this.builderConfigFecets[i].explorer_chamber_name == "") {

      } else {

        builderConfigFecet.push(this.builderConfigFecets[i]);
      }
    }

    console.log("delete builderConfigFecet", builderConfigFecet);
    console.log("delete configID", this.configID);
    
    if (builderConfigFecet.length == 1) {
  
      const dialogRef = this.dialog.open(DeleteConfigConfirmationDialog, {

        width: '350px',
        height: '170px',
        data: {}
      });

      dialogRef.afterClosed().subscribe(result => {
  
        console.log(`DeleteConfigConfirmationDialog afterClosed result: ${result}`);
        if (result == "YES") {
          
          this.apiService.deleteConfiguration(this.configID).subscribe(response => {

            console.log('delete Configuration', response);
            
            localStorage.removeItem("selectedSavedCofiguration");
            this.router.navigate(['builder/configuration']);
         });
        }
      });
    } else {

      if (this.isFromSystemID == "false") {

        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          if (i == index) {
            finalConfigurationArray.push({
              config_id:this.builderConfigFecets[i].config_id,
              chamber_family_id:"0",
              chamber_family_name:"",
              chamber_id:"0",
              chamber_name:"",
              facet_name:this.builderConfigFecets[i].facet_name,
              id:this.builderConfigFecets[i].id,
            });
          } else {
            finalConfigurationArray.push({
              config_id:this.builderConfigFecets[i].config_id,
              chamber_family_id:this.builderConfigFecets[i].chamber_family_id,
              chamber_family_name:this.builderConfigFecets[i].chamber_family_name,
              chamber_id:this.builderConfigFecets[i].chamber_id,
              chamber_name:this.builderConfigFecets[i].chamber_name,
              facet_name:this.builderConfigFecets[i].facet_name,
              id:this.builderConfigFecets[i].id,
            });
          }
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);

        this.apiService.updateConfiguration(this.headerTitle, this.configID, this.selectedCustomerid, finalConfigurationArray).subscribe(response => {
        
          console.log("deleteChamber-Response - updateConfiguration: ", response);

          for( var i = 0; i < this.builderConfigFecets.length; i++) {

            if (i == index) {
      
              this.builderConfigFecets[i].chamber_name = "";
              this.builderConfigFecets[i].chamber_family_name = "";
              this.builderConfigFecets[i].chamber_id = "0";
              this.builderConfigFecets[i].chamber_family_id = "0";
              this.builderConfigFecets[i].got_code = "";
            }
            console.log("delete chamber()",this.builderConfigFecets);
          }
      
          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";
      
          this.toastMessage.open(message,'', {
      
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {
    
        });

        this.loadSvgImage();
      } else {
          
        let finalConfigurationArray:any = [];

        for(var i = 0; i < this.builderConfigFecets.length; i++) {

          if (i == index) {
            finalConfigurationArray.push({
              facet_name:this.builderConfigFecets[i].facet_name,
              chamber_name: "",
              chamber_family_name: "",
              chamber_id: "0",
              chamber_family_id: "0",
            });
          } else {
            finalConfigurationArray.push({
              facet_name: this.builderConfigFecets[i].facet_name,
              chamber_name: this.builderConfigFecets[i].chamber_name,
              chamber_family_name: this.builderConfigFecets[i].chamber_family_name,
              chamber_id: this.builderConfigFecets[i].chamber_id,
              chamber_family_id: this.builderConfigFecets[i].chamber_family_id,
              // got_code: this.builderConfigFecets[i].got_code,
            });
          }
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);
        
        let headerTitle = this.headerTitle + " BP Rev-1"
        this.apiService.addConfiguration(headerTitle, this.selectedCustomerid, this.selectedConfigPlatform.id, finalConfigurationArray).subscribe(response => {
        
          console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));

          this.configID = String(JSON.parse(JSON.stringify(response)).ConfigID);
          this.headerTitle = String(JSON.parse(JSON.stringify(response)).config_name);

          this.isFromSystemID = "false";
          localStorage.setItem("IsFromSystemID", "false");
          
          this.isEditableTitle = false;

          this.router.navigate(['../find-configuration'],{ relativeTo: this.route ,queryParams: { id: this.configID }});
          let configurationArray:any = [];

          configurationArray = JSON.parse(JSON.stringify(response)).configuration;
          console.log("Response - configurationArray: ", configurationArray);

            // this.builderConfigFecets = [];
          for(var i = 0; i < configurationArray.length; i++){

            for (var j = 0; j < this.builderConfigFecets.length; j++) {

              if (configurationArray[i].facet_name == this.builderConfigFecets[j].facet_name) {

                this.builderConfigFecets[j].chamber_name = configurationArray[i].chamber_name;
                this.builderConfigFecets[j].config_id = configurationArray[i].config_id;
                this.builderConfigFecets[j].id = configurationArray[i].id;
                this.builderConfigFecets[j].chamber_family_name = configurationArray[i].chamber_family_name;
                this.builderConfigFecets[j].got_code = configurationArray[i].gotCode;
              }
            }
          }

          console.log("after configuration ", this.builderConfigFecets);

          let message = "Changes to" +' '+ this.headerTitle + ' ' + "have been saved.";

          this.toastMessage.open(message,'', {
            
            panelClass: ['toastStyles'],
            duration: 2000,
          });
        }, error => {
    
        });

        this.loadSvgImage();
      }
    }
  }

  continueWithCurrentConfig() {

    // this.router.navigate(['builder/nso-configuration'], { queryParams: { id:  this.configID} });
    const dialogRef = this.dialog.open(NSOFlowDialog, {

      width: '370px',
      height: '150px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {

      console.log(`NSOFlowDialog afterClosed result: ${result}`);
      
      if (result == "YES") {

        console.log("NSOFlowDialog afterClosed isFromSystemID:", this.isFromSystemID);

        localStorage.setItem("ShowLocalNSOConfig", "0");
        localStorage.setItem("BuilderSVGImage", this.imageURL);
        localStorage.setItem("IsFromSystemID", this.isFromSystemID);
        this.router.navigate(['builder/nso-configuration'], { queryParams: { id:  this.configID} });
      }
    });
  }

  mouseenter() {

    this.isHoverCheckMark = true;
  }

  mouseleave() {

    this.isHoverCheckMark = false;
  }
}

export class ColorModel {

  productName: string;
  productColor: string;
}

@Component({

  selector: 'NSOFlowDialog',
  templateUrl: 'NSOFlowDialog.html',
  styleUrls: ['./NSOFlowDialog.css'],
})

export class NSOFlowDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<NSOFlowDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,public apiService: ApiService, private router: Router,private route: ActivatedRoute, private location: Location) {
     
  }

  ngOnInit() {

  }

  onNoButtonClicks() {

    this.dialogRef.close('NO');
  }

  onYesButtonClicks() {

    this.dialogRef.close('YES');
  }
}

@Component({

  selector: 'DeleteConfigConfirmationDialog',
  templateUrl: 'DeleteConfigConfirmationDialog.html',
  styleUrls: ['./DeleteConfigConfirmationDialog.css'],
})

export class DeleteConfigConfirmationDialog implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteConfigConfirmationDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,public apiService: ApiService, private router: Router,private route: ActivatedRoute, private location: Location) {
     
  }

  ngOnInit() {

  }

  onNoButtonClicks() {

    this.dialogRef.close('NO');
  }

  onYesButtonClicks() {

    this.dialogRef.close('YES');
  }
}

@Component({

  selector: 'config-title-exit-dialog',
  templateUrl: 'ConfigTitleExitDialog.html',
})

export class ConfigTitleExitDialog {

  constructor(public dialogRef: MatDialogRef<ConfigTitleExitDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogTitleExitData) { }

  dialogOK() {
    
    this.dialogRef.close();
  }
}

export interface DialogTitleExitData {

  message: string;
}