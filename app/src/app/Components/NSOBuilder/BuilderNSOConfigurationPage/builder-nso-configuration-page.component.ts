import { MatSnackBar } from '@angular/material/snack-bar';
import { style } from '@angular/animations';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { MatIconRegistry, MatSelect,  MatDialogRef, MAT_DIALOG_DATA, MatDialog, } from '@angular/material';import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  
  selector: 'app-builder-nso-configuration-page',
  templateUrl: './builder-nso-configuration-page.component.html',
  styleUrls: ['./builder-nso-configuration-page.component.css'],
})

export class BuilderNSOConfigurationPageComponent implements OnInit {

  page = "1";
  pageSize = "1";
  sortBy = "name";
  sortOrder = "asc";
  filterTerms = "";
  nsoHeaderTitle;
  isImageHidden = true;
  isReviewChangesButtonVisible = true;
  isUpgradableRule = false;

  selectedUserBySystemID:any = {};
  configFecets:any = [];
  nsoConfigFecets:any = [];
  svgColorArray: Array<ColorModel> = [];
  svgDummyColorCodes: any[] = [];
  selectedConfigurationBySystemID:any = [];
  searchNSOExplorerChambersList:any = [];
  explorerNSOChambersFamily:any = [];
  explorerNSOChambersBody:any = [];
  nsoChambersByFamilyID:any = [];
  nsoExplorerChambersFamily:any = [];
  getConfigurationDetailsArray:any = [];

  familyName = "family New Value";
  public modeselect = '646465465456';

  nsoChamberListMouseoverPosition;
  isEditNSOHeader:boolean = false;
  selectedNSOChamberIndexPosition;

  imageURL:string = '';

  selectedChamberID;
  selectedChamberFamilyID;
  selectedNSOChamberFamilytemID;
  selectedNSOChamberFamilyItemName;
  chamberActionMessage;
  selectedFecetFamilyID;
  selectedChamberGotCode;

  selectedFecetChamberID;
  domIDsList;
  configurationID;
  nsoSelectedFecetName;

  currentChamber;
  currentChamberGotCode;
  newChamber;
  newChamberGotCode;

  chamberIDForExplorer;
  chamberFamilyIDForExplorer;

  nsoFormGroup: FormGroup;
  addChamberFamilyID;

  familyIDforActionMessage;
  nsoFamilyIDforActionMessage;

  nsoCustomerID;
  nsoPlatformID;

  disabledChamberFamilyForModify = true;

  spinnerValue = 0;
  interval;
  timeLeft: number = 0;
  spinnerMode = "determinate";

  isFromSystemID = 'false';
  isEditableTitle = false;

  isSelectedABPositions = false;
  chambersForAB: any = [];

  headerPlatformName = "";

  @ViewChild('nsoConfigTitle') nsoConfigTitle:ElementRef;
  @ViewChild('findNSOChmberSearchInput') private findNSOChmberSearchInput: ElementRef;
  @ViewChild('selectNSOChamberFamilyDropdown') chamberFamilyselectDropdown: MatSelect;

  findNSOChamberForm = this.formBuilder.group({

    // findNSOChamberFormBody: [null, [Validators.required]],
    findNSOChamberFormName: ['', Validators.required],
  });

  get findNSOChamberFormControl(): any {

    return this.findNSOChamberForm.controls;
  }

  disabledReviewDelta = true;
  disabledSaveClose = true;

  constructor(public apiService:ApiService, private appComp: AppComponent,private location:Location,private formBuilder: FormBuilder,public dialog: MatDialog,
    public iconRegistry: MatIconRegistry, public sanitizer: DomSanitizer, private elem: ElementRef,public toastMessage: MatSnackBar, private route: ActivatedRoute,
    private router: Router) {

    this.apiService.showheader();

    this.svgDummyColorCodes = [

      {"ColorCode": "#4B9DB7"}, {"ColorCode": "#546FA6"}, {"ColorCode": "#223884"}, {"ColorCode": "#00B5E2"}, {"ColorCode": "#99D6EA"},
      {"ColorCode": "#007576"}, {"ColorCode": "#83C447"}, {"ColorCode": "#235723"}, {"ColorCode": "#2A8A60"}, {"ColorCode": "#4BD9B7"},
      {"ColorCode": "#546AF6"}
    ];

    this.route.queryParams.subscribe(params => {

      console.log("queryParams-id",params['id']);
      this.configurationID = params['id'];
    });

    this.imageURL = localStorage.getItem('BuilderSVGImage');
    // this.imageURL = "assets/ENDURANocircle.svg";
    // this.imageURL = "assets/SingleProducer2NoCircle.svg";
    // this.imageURL = "assets/ENDURANocircleP4.svg";
    // this.imageURL = "assets/Centura2NoCircle.svg";
    // this.imageURL = "assets/Charger2NoCircle.svg";
    // this.imageURL = "assets/CHARGER2LinkNoCircle.svg";
    console.log("local storage-BuilderSVGImage", this.imageURL);
    this.iconRegistry.addSvgIcon('nsoproductImageIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));

    this.startSpinnerUpdateTimer();
    
    setTimeout(()=> {

      this.loadSvgImage();
    }, 5000);
    
    this.isFromSystemID = localStorage.getItem('IsFromSystemID');
    console.log("IsFromSystemID",this.isFromSystemID);
    
    if (this.isFromSystemID == "false") {

      this.isEditableTitle = false;

      this.apiService.getConfigurationDetails(this.configurationID).subscribe(response => {
        
        console.log("nso-getConfigurationDetails-response", response);
        this.getConfigurationDetailsArray  = JSON.parse(JSON.stringify(response));
        console.log("nso-getConfigurationDetails getConfigurationDetailsArray", this.getConfigurationDetailsArray);

        this.nsoHeaderTitle = this.getConfigurationDetailsArray.name;

        this.nsoCustomerID = this.getConfigurationDetailsArray.customer_id;
        this.nsoPlatformID = this.getConfigurationDetailsArray.platform_family_id;

        this.headerPlatformName = this.getConfigurationDetailsArray.platform_family_name;

        // this.customerProjectNo = this.getConfigurationDetailsArray.customer_project_no;

        console.log("ngOnInit currentConfiguration: ", JSON.parse(localStorage.getItem("currentConfiguration")));
        console.log("ngOnInit newConfiguration: ", JSON.parse(localStorage.getItem("newConfiguration")));
        console.log("ngOnInit g3platformID: ", localStorage.getItem("G3platformID"));
        console.log("ngOnInit customerID: ", localStorage.getItem("customerID"));
        console.log("ngOnInit nsoCOnfigName: ", localStorage.getItem("NSOConfigName"));
        console.log("ngOnInit ShowLocalNSOConfig: ", localStorage.getItem("ShowLocalNSOConfig"));

        let ShowLocalNSOConfig = localStorage.getItem("ShowLocalNSOConfig");
        if (ShowLocalNSOConfig == "1") {

          this.nsoConfigFecets = JSON.parse(localStorage.getItem("newConfiguration"));
          this.nsoHeaderTitle = localStorage.getItem("NSOConfigName");

          this.disabledReviewDelta = false;
          this.disabledSaveClose = false;
        } else {

          console.log("nso-getConfigurationDetailsArray", this.getConfigurationDetailsArray.configuration);

          for(var i = 0; i < this.getConfigurationDetailsArray.configuration.length; i++) {

            this.nsoConfigFecets.push({
              facet_name:this.getConfigurationDetailsArray.configuration[i].facet_name,
              chamber_name:this.getConfigurationDetailsArray.configuration[i].chamber_name,
              chamber_family_name:this.getConfigurationDetailsArray.configuration[i].chamber_family_name,
              config_id:this.getConfigurationDetailsArray.configuration[i].config_id,
              id:this.getConfigurationDetailsArray.configuration[i].id,
              chamber_id:this.getConfigurationDetailsArray.configuration[i].chamber_id,
              chamber_family_id:this.getConfigurationDetailsArray.configuration[i].chamber_family_id,
              got_code:this.getConfigurationDetailsArray.configuration[i].gotCode,
            });
          }
        }

        console.log("getConfigurationDetailsArray - nsoConfigFecets",this.nsoConfigFecets);
      });

      this.apiService.updateConfigNSOFlag(this.configurationID).subscribe(response => {

        console.log("updateConfigNSOFlag-response",response);
      });
    } else {

      this.isEditableTitle = true;

      let selectedCustomerid = localStorage.getItem('selectedCustomerid');
      let selectedFabID = localStorage.getItem('selectedFabID');
      let selectedProjectNoID = localStorage.getItem('selectedProjectNoID');

      console.log("getMasterSystemIdConfigurations configurationID", this.configurationID);
      console.log("getMasterSystemIdConfigurations selectedCustomerid", selectedCustomerid);
      console.log("getMasterSystemIdConfigurations selectedFabID", selectedFabID);

      this.apiService.getMasterSystemIdConfigurations(this.configurationID, selectedCustomerid, selectedFabID, selectedProjectNoID).subscribe(response => {
        
        console.log("nso-getConfigurationDetails-response", response);
        this.getConfigurationDetailsArray  = JSON.parse(JSON.stringify(response));
        console.log("nso-getConfigurationDetails getConfigurationDetailsArray", this.getConfigurationDetailsArray);

        this.nsoHeaderTitle = this.getConfigurationDetailsArray.name;

        this.nsoCustomerID = this.getConfigurationDetailsArray.customer_id;
        this.nsoPlatformID = this.getConfigurationDetailsArray.platform_family_id;

        this.headerPlatformName = this.getConfigurationDetailsArray.platform_family_name;

        // this.customerProjectNo = this.getConfigurationDetailsArray.customer_project_no;

        console.log("ngOnInit currentConfiguration: ", JSON.parse(localStorage.getItem("currentConfiguration")));
        console.log("ngOnInit newConfiguration: ", JSON.parse(localStorage.getItem("newConfiguration")));
        console.log("ngOnInit g3platformID: ", localStorage.getItem("G3platformID"));
        console.log("ngOnInit customerID: ", localStorage.getItem("customerID"));
        console.log("ngOnInit nsoCOnfigName: ", localStorage.getItem("NSOConfigName"));
        console.log("ngOnInit ShowLocalNSOConfig: ", localStorage.getItem("ShowLocalNSOConfig"));

        let ShowLocalNSOConfig = localStorage.getItem("ShowLocalNSOConfig");
        if (ShowLocalNSOConfig == "1") {

          this.nsoConfigFecets = JSON.parse(localStorage.getItem("newConfiguration"));
          this.nsoHeaderTitle = localStorage.getItem("NSOConfigName");

          this.disabledReviewDelta = false;
          this.disabledSaveClose = false;
        } else {

          console.log("nso-getConfigurationDetailsArray", this.getConfigurationDetailsArray.configuration);

          for(var i = 0; i < this.getConfigurationDetailsArray.configuration.length; i++) {

            this.nsoConfigFecets.push({
              facet_name:this.getConfigurationDetailsArray.configuration[i].facet_name,
              chamber_name:this.getConfigurationDetailsArray.configuration[i].chamber_name,
              chamber_family_name:this.getConfigurationDetailsArray.configuration[i].chamber_family_name,
              config_id:this.getConfigurationDetailsArray.configuration[i].config_id,
              id:this.getConfigurationDetailsArray.configuration[i].id,
              chamber_id:this.getConfigurationDetailsArray.configuration[i].chamber_id,
              chamber_family_id:this.getConfigurationDetailsArray.configuration[i].chamber_family_id,
              got_code:this.getConfigurationDetailsArray.configuration[i].gotCode,
            });
          }
        }

        console.log("getConfigurationDetailsArray - nsoConfigFecets",this.nsoConfigFecets);
      });
    }

		this.nsoFormGroup = this.formBuilder.group({

      formGroupChamberFamilyValue: ['', Validators.required],
      formGroupChamberValue:['', Validators.required],
		});
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

    this.appComp.hide();
    this.appComp.toggleRightSidenav();
    // this.findNSOChamberFormControl.reset();
  }

  // ngAfterContentChecked() {

  //   this.domIDsList = document.querySelector('object').ownerDocument.documentElement.querySelectorAll('g');
  //   this.loadSvgImage();
  // }

  loadSvgImage() {

    let dummySVGColorArray = [];
    setTimeout(()=> {

      this.domIDsList = document.querySelector('object').ownerDocument.documentElement.querySelectorAll('g');
      console.log("domIDsList",this.domIDsList);
      console.log("domIDsList nsoConfigFecets: ",this.nsoConfigFecets);

      for(var i = 0; i < this.nsoConfigFecets.length; i++) {

        if(this.nsoConfigFecets[i].chamber_name == '') {
  
          for(var j = 0; j < this.domIDsList.length; j++) {
            
            if(this.domIDsList[j].id === this.nsoConfigFecets[i].facet_name + '-ACTIVE') {

              this.domIDsList[j].childNodes[1].style.fill = 'gray';
            } else {

            }
          }
        } else {

          let colorModel = new ColorModel();
          colorModel.productName = this.nsoConfigFecets[i].chamber_name;
          colorModel.productColor = this.svgDummyColorCodes[i].ColorCode;
          dummySVGColorArray.push(colorModel);
        }
        this.isImageHidden = false;
      }

      for(let i = 0; i < dummySVGColorArray.length; i++) {

        this.checkDiplicateSVGColors(dummySVGColorArray[i]);
      }

      console.log("domIDsList svgColorArray: ",this.svgColorArray);

      for(var i = 0; i < this.nsoConfigFecets.length; i++) {

        if(this.nsoConfigFecets[i].chamber_name == '') {

        } else {

          for(var j = 0; j < this.svgColorArray.length; j++) {

            if(this.nsoConfigFecets[i].chamber_name == this.svgColorArray[j].productName) {
            
              for(var k = 0; k < this.domIDsList.length; k++) {
            
                if(this.domIDsList[k].id === this.nsoConfigFecets[i].facet_name + '-ACTIVE') {

                  this.domIDsList[k].childNodes[1].style.fill = this.svgColorArray[j].productColor;
                } else {
                }
              }
            }
          }
        }
      }
    }, 500);
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

    console.log("nsoConfigTitle", this.nsoConfigTitle.nativeElement.value);

    if (this.nsoConfigTitle.nativeElement.value == "") {

      this.disabledSaveClose = true;
    } else {
      
      this.disabledSaveClose = false;
    }
  }

  viewDetailsClick(fecets,index) {

    this.currentChamber = fecets.chamber_name;
    this.currentChamberGotCode = fecets.got_code;
    // this.chamberActionMessage = "upgrade";
    this.selectedNSOChamberIndexPosition = index;
    console.log("viewDetailsClick",fecets);
    this.nsoSelectedFecetName = fecets.facet_name;
    this.selectedFecetChamberID = fecets.chamber_id;
    this.selectedFecetFamilyID = fecets.chamber_family_id;

    this.chamberIDForExplorer = this.selectedFecetChamberID;
    this.chamberFamilyIDForExplorer = this.selectedFecetFamilyID;

    this.familyIDforActionMessage = fecets.chamber_family_id;
    this.nsoFamilyIDforActionMessage = "0";

    this.isReviewChangesButtonVisible = true;
    this.isUpgradableRule = true;

    document.getElementById("nsosidenavDrawer").style.width = "100%";

    this.selectedNSOChamberFamilytemID = fecets.chamber_family_id;
    this.selectedNSOChamberFamilyItemName = fecets.chamber_family_name;

    // if (this.nsoSelectedFecetName == "A" || this.nsoSelectedFecetName == "B") {

    //   this.isSelectedABPositions = true;

    //   this.selectedNSOChamberFamilytemID = "0";
    //   this.selectedNSOChamberFamilyItemName = "";

    //   this.apiService.getChamberNamesForFacet(this.nsoSelectedFecetName).subscribe(response => {

    //     this.chambersForAB = JSON.parse(JSON.stringify(response));
    //     console.log("getChamberNamesForFacet Response - chambersForAB: ", this.chambersForAB);
    //   }, error => {
  
    //   });
    // } else {

      this.isSelectedABPositions = false;
      this.disabledChamberFamilyForModify = true;

      this.apiService.getExplorerChamberFamilies(this.nsoPlatformID, this.nsoSelectedFecetName).subscribe(response => {

        this.nsoExplorerChambersFamily = JSON.parse(JSON.stringify(response));
        const toSelect = this.nsoExplorerChambersFamily.items.find(c => c.id == fecets.chamber_family_id);
        this.nsoFormGroup.get('formGroupChamberFamilyValue').setValue(toSelect);
        console.log("viewDetailsClick-toFamilySelect",toSelect);
    
          console.log("Response - nsoExplorerChambersFamily: ", this.nsoExplorerChambersFamily);
        }, error => {
    
        });

        let nsoChambersByFamilyID1:any = []; 
        this.apiService.getPossibleUpgradeChambers(fecets.chamber_family_id, fecets.chamber_id).subscribe(response => {

        this.nsoChambersByFamilyID = JSON.parse(JSON.stringify(response));
        console.log("viewDetailsClick-getPossibleUpgradeChambers",this.nsoChambersByFamilyID);

        const toChamberSelect = this.nsoChambersByFamilyID.find(c => c.id == fecets.chamber_id);
        this.nsoFormGroup.get('formGroupChamberValue').setValue(toChamberSelect);
        console.log("viewDetailsClick-toChamberSelect",toChamberSelect);
      }, error => {

      });
    // } 
  }

  upgradeSelectedChamber(fecets,index) {

    this.currentChamber = fecets.chamber_name;
    this.currentChamberGotCode = fecets.got_code;
    // this.chamberActionMessage = "upgrade";
    this.selectedNSOChamberIndexPosition = index;
    console.log("viewDetailsClick",fecets);
    this.nsoSelectedFecetName = fecets.facet_name;
    this.selectedFecetChamberID = fecets.chamber_id;
    this.selectedFecetFamilyID = fecets.chamber_family_id;

    this.chamberIDForExplorer = this.selectedFecetChamberID;
    this.chamberFamilyIDForExplorer = this.selectedFecetFamilyID;

    this.familyIDforActionMessage = fecets.chamber_family_id;
    this.nsoFamilyIDforActionMessage = "0";

    this.disabledChamberFamilyForModify = false;

    this.isReviewChangesButtonVisible = true;
    this.isUpgradableRule = false;

    document.getElementById("nsosidenavDrawer").style.width = "100%";

    // if (this.nsoSelectedFecetName == "A" || this.nsoSelectedFecetName == "B") {

    //   this.isSelectedABPositions = true;

    //   this.selectedNSOChamberFamilytemID = "0";
    //   this.selectedNSOChamberFamilyItemName = "";

    //   this.apiService.getChamberNamesForFacet(this.nsoSelectedFecetName).subscribe(response => {

    //     this.chambersForAB = JSON.parse(JSON.stringify(response));
    //     console.log("getChamberNamesForFacet Response - chambersForAB: ", this.chambersForAB);
    //   }, error => {
  
    //   });
    // } else {

      this.isSelectedABPositions = false;

      this.apiService.getExplorerChamberFamilies(this.nsoPlatformID, this.nsoSelectedFecetName).subscribe(response => {

        this.nsoExplorerChambersFamily = JSON.parse(JSON.stringify(response));
        const toSelect = this.nsoExplorerChambersFamily.items.find(c => c.id == fecets.chamber_family_id);
        this.nsoFormGroup.get('formGroupChamberFamilyValue').setValue(toSelect);
        console.log("viewDetailsClick-toFamilySelect",toSelect);
  
        console.log("Response - nsoExplorerChambersFamily: ", this.nsoExplorerChambersFamily);
      }, error => {
  
      });

      let nsoChambersByFamilyID1:any = []; 
      this.apiService.getChambersByFamilyID(fecets.chamber_family_id).subscribe(response => {

        nsoChambersByFamilyID1 = JSON.parse(JSON.stringify(response));
        this.nsoChambersByFamilyID = nsoChambersByFamilyID1.items;
          
        const toChamberSelect = this.nsoChambersByFamilyID.find(c => c.id == fecets.chamber_id);
        this.nsoFormGroup.get('formGroupChamberValue').setValue(toChamberSelect);
        console.log("viewDetailsClick-toChamberSelect",toChamberSelect);

        console.log("viewDetailsClick-getChambersByFamilyID",this.nsoChambersByFamilyID);
      }, error => {

      });
    // }
  }

  closeNavigationDrawer() {

    this.nsoFormGroup.reset();
    document.getElementById("nsosidenavDrawer").style.width = "0%";
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

  editNSOHeaderClick() {

    this.isEditNSOHeader = true;

    setTimeout(()=>{
      this.nsoConfigTitle.nativeElement.focus();
    },0);  
  }
  
  outEditNSOHeaderfocus() {

    this.isEditNSOHeader = false;
  }

  nsoHeaderLogo() {

    // this.router.navigate(['builder/configuration']);
    this.location.back();
  }

  selectedNSOChamberFamilityItem(category) {

    console.log("selectedNSOChamberFamilyItem",category);
    this.selectedNSOChamberFamilytemID = category.id;
    this.selectedNSOChamberFamilyItemName = category.name;

   this.nsoFamilyIDforActionMessage = category.id;

   this.isReviewChangesButtonVisible = true;

    if (this.familyIDforActionMessage == 0) {

      this.chamberActionMessage = "add";
    } else if(this.familyIDforActionMessage == this.nsoFamilyIDforActionMessage) {

      this.chamberActionMessage = "upgrade";
    } else if(this.familyIDforActionMessage != this.nsoFamilyIDforActionMessage){

      this.chamberActionMessage = "repurpose";
    }

    let nsoChambersByFamilyID1:any = []; 
    this.nsoChambersByFamilyID = [];
    this.apiService.getChambersByFamilyID(this.selectedNSOChamberFamilytemID).subscribe(response => {

      nsoChambersByFamilyID1 = JSON.parse(JSON.stringify(response));
      this.nsoChambersByFamilyID = nsoChambersByFamilyID1.items;
        
      console.log("nsoChambersByFamilyID",this.nsoChambersByFamilyID);
    }, error => {

    });
  }

  selectedNSOChamberItem(chamberCategory) {

    console.log("selectedNSOChamberItem chamberCategory: ", chamberCategory);

    this.selectedChamberID = chamberCategory.id;
    this.newChamber = chamberCategory.name;
    this.newChamberGotCode = chamberCategory.gotCode;
    this.selectedChamberGotCode = chamberCategory.gotCode;
    console.log("selectedNSOChamberItem", this.selectedChamberID);

    this.chamberIDForExplorer = this.selectedChamberID;
    this.chamberFamilyIDForExplorer = this.selectedNSOChamberFamilytemID;

    if(this.nsoFamilyIDforActionMessage == "0") {

      this.chamberActionMessage = "upgrade";
    }

    if(this.selectedFecetChamberID == this.selectedChamberID) {

      this.isReviewChangesButtonVisible = true;
    } else {

      this.isReviewChangesButtonVisible = false;
    }
  }

  selectedNSOChamberABItem(chamberCategory) {

    console.log("selectedNSOChamberItem chamberCategory: ", chamberCategory);

    this.selectedChamberID = "0";
    this.newChamber = chamberCategory.name;
    this.newChamberGotCode = chamberCategory.gotCode;
    this.selectedChamberGotCode = chamberCategory.gotCode;
    console.log("selectedNSOChamberItem", this.selectedChamberID);

    this.chamberIDForExplorer = "0";
    this.chamberFamilyIDForExplorer = "0";

    if(this.nsoFamilyIDforActionMessage == "0") {

      this.chamberActionMessage = "upgrade";
    }

    this.isReviewChangesButtonVisible = false;
  }

  addNSOChamber(fecets,index) {
    
    this.addChamberFamilyID = 0;
    this.selectedFecetChamberID = "";
    this.currentChamber = '';
    this.currentChamberGotCode = '';
    // this.chamberActionMessage = "add";
    console.log("addNSOChamber",fecets);
    this.selectedNSOChamberIndexPosition = index;
    this.nsoSelectedFecetName = fecets.facet_name;

    this.familyIDforActionMessage = fecets.chamber_family_id;
    document.getElementById("nsosidenavDrawer").style.width = "100%";

    this.disabledChamberFamilyForModify = false;

    this.selectedFecetFamilyID = 0;
    
    // if (this.nsoSelectedFecetName == "A" || this.nsoSelectedFecetName == "B") {

    //   this.isSelectedABPositions = true;

    //   this.selectedNSOChamberFamilytemID = "0";
    //   this.selectedNSOChamberFamilyItemName = "";

    //   this.apiService.getChamberNamesForFacet(this.nsoSelectedFecetName).subscribe(response => {

    //     this.chambersForAB = JSON.parse(JSON.stringify(response));
    //     console.log("getChamberNamesForFacet Response - chambersForAB: ", this.chambersForAB);
    //   }, error => {
  
    //   });
    // } else {

      this.isSelectedABPositions = false;

      this.apiService.getExplorerChamberFamilies(this.nsoPlatformID, this.nsoSelectedFecetName).subscribe(response => {
        
        this.nsoExplorerChambersFamily = JSON.parse(JSON.stringify(response));
        console.log("Response - nsoExplorerChambersFamily: ", this.nsoExplorerChambersFamily);
      }, error => {

      });
    // }

    console.log("this.selectedFecetChamberID",this.selectedFecetChamberID);
    console.log("this.selectedChamberID",this.selectedChamberID);

    this.isReviewChangesButtonVisible = true;
  }

  removeSelectedChamber(fecets,index) {

    for( var i = 0; i < this.nsoConfigFecets.length; i++) {

      if (i == index) {

        this.nsoConfigFecets[i].chamber_name = "";
        this.nsoConfigFecets[i].chamber_family_name = "";
        this.nsoConfigFecets[i].chamber_id = "0";
        this.nsoConfigFecets[i].chamber_family_id = "0";
        this.nsoConfigFecets[i].got_code = "";
      }
    }

    console.log("remove chamber()",this.nsoConfigFecets);

    this.disabledReviewDelta = false;
    this.disabledSaveClose = false;
    
    this.loadSvgImage();
  }

  navigateToExplorerFromDrawer() {

    this.navigateToExplorer(this.chamberIDForExplorer, this.chamberFamilyIDForExplorer);
  }

  navigateToExplorerFromMenu(fecets, index) {

    let explorerChamberID = fecets.chamber_id;
    let explorerChamberFamilyID = fecets.chamber_family_id;

    this.navigateToExplorer(explorerChamberID, explorerChamberFamilyID);
  }

  navigateToExplorer(explorerChamberID, explorerChamberFamilyID) {

    console.log("navigateToExplorer explorerChamberID ", explorerChamberID);
    console.log("navigateToExplorer explorerChamberFamilyID ", explorerChamberFamilyID);

    this.apiService.getChambersByFamilyID(explorerChamberFamilyID).subscribe(response => {
      console.log("ApiService getChambersByFamilyID", response);

      let chambers = JSON.parse(JSON.stringify(response));
      console.log("chambers", chambers);

      for (let i = 0; i < chambers.items.length; i++) {

        if (chambers.items[i].id == explorerChamberID) {

          this.navigateToDetailsPageUsingPath(chambers.items[i]);
        }
      }
    }, error => {

    });
  }

  navigateToDetailsPageUsingPath(searchResultItem) {

    console.log("navigateToDetailsPage searchResultItem", searchResultItem);

    let splittedList = searchResultItem.full_path_components; 
    console.log("navigateToDetailsPage splittedList", splittedList);

    splittedList.splice(0, 1); 
    console.log("navigateToDetailsPage after splittedList", splittedList);

    if (splittedList.length == 1) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      this.router.navigate(['explorer', platformName]);
    } else if (splittedList.length == 2) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      this.router.navigate(['explorer', platformName, levelOne]);
    } else if (splittedList.length == 3) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = splittedList[2];
      this.router.navigate(['explorer', platformName, levelOne, levelTwo]);
    } else if (splittedList.length == 4) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree]);
    } else if (splittedList.length == 5) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      let levelFour = this.convertSlashToURL(splittedList[4]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree, levelFour]);
    } else if (splittedList.length == 6) {

      let platformName = this.convertSlashToURL(splittedList[0]);
      let levelOne = this.convertSlashToURL(splittedList[1]);
      let levelTwo = this.convertSlashToURL(splittedList[2]);
      let levelThree = this.convertSlashToURL(splittedList[3]);
      let levelFour = this.convertSlashToURL(splittedList[4]);
      let levelFive = this.convertSlashToURL(splittedList[5]);
      this.router.navigate(['explorer', platformName, levelOne, levelTwo, levelThree, levelFour, levelFive]);
    }
  }

  convertSlashToURL(itemName) {

    console.log("convertSlashToURL itemName ", itemName);

    if (itemName.includes("/")) {

      return itemName.split('/').join("%2F");
    } else {

      return itemName;
    }
  }
  
  // searchNSOExplorerChamberClick(searchNSOExplorerChamber) {

  //   this.apiService.getExplorerChamberFamilies().subscribe(response => {

  //     this.explorerNSOChambersFamily = JSON.parse(JSON.stringify(response));
  //       console.log("Response - explorerNSOChambersFamily: ", this.explorerNSOChambersFamily);
  //     }, error => {
  
  //     });
  // }

  nsoChamberListItemMouseover(index) {

    this.nsoChamberListMouseoverPosition = index;
  }

  nsoChamberListItemMouseLeave() {

    this.nsoChamberListMouseoverPosition = -1;
  }
  
   onNSOSearchKeyUp(event) {

    if(event.target.value == "" ) {

      this.searchNSOExplorerChambersList = [];
    } else {

      this.filterTerms = event.target.value;
      console.log("event",event.target.value);
      this.apiService.getSearchExplorerChambers(this.filterTerms, this.page, this.pageSize, this.sortBy, this.sortOrder).subscribe(response => {
  
        this.searchNSOExplorerChambersList = JSON.parse(JSON.stringify(response));
        console.log("Response - getSearchNSOExplorerChambers searchNSOExplorerChambersList: ", this.searchNSOExplorerChambersList);
      }, error => {
  
      });
    }
  }
  
   findNSOChmberSearchClear() {

    this.searchNSOExplorerChambersList = [];
    this.findNSOChmberSearchInput.nativeElement.value = '';
  }

  saveNSOConfiguration() {

    console.log("saveNSOConfiguration nsoConfigTitle",this.nsoHeaderTitle);
    console.log("saveNSOConfiguration configurationID",this.configurationID);
    console.log("saveNSOConfiguration nsoConfigFecets",this.nsoConfigFecets);

    console.log("saveNSOConfiguration isFromSystemID",this.isFromSystemID);

    if (this.isFromSystemID == "false") {

      let updateNSOConfigFecets:any = [];

        for(var i = 0; i < this.nsoConfigFecets.length; i++) {

          updateNSOConfigFecets.push({
            config_id:this.nsoConfigFecets[i].config_id,
            chamber_family_id:this.nsoConfigFecets[i].chamber_family_id,
            chamber_family_name:this.nsoConfigFecets[i].chamber_family_name,
            chamber_id:this.nsoConfigFecets[i].chamber_id,
            chamber_name:this.nsoConfigFecets[i].chamber_name,
            facet_name:this.nsoConfigFecets[i].facet_name,
            id:this.nsoConfigFecets[i].id,
          });
        }

        console.log("Response -sending to sevice updateNSOConfigFecets",updateNSOConfigFecets);

      this.apiService.updateConfiguration(this.nsoHeaderTitle, this.configurationID, this.nsoCustomerID, updateNSOConfigFecets).subscribe(response => {

        console.log("Response - updateConfiguration: ", response);

        // this.nsoHeaderLogo();
        this.router.navigate(['builder/configuration']);
      }, error => {

      });
    } else {
      let finalConfigurationArray:any = [];

        for(var i = 0; i < this.nsoConfigFecets.length; i++) {

          finalConfigurationArray.push({
            facet_name:this.nsoConfigFecets[i].facet_name,
            chamber_name:this.nsoConfigFecets[i].chamber_name,
            chamber_family_name:this.nsoConfigFecets[i].chamber_family_name,
            chamber_id:this.nsoConfigFecets[i].chamber_id,
            chamber_family_id:this.nsoConfigFecets[i].chamber_family_id,
            // got_code: this.builderConfigFecets[i].got_code,
          });
        }

        console.log("Response -sending to sevice finalConfigurationArray",finalConfigurationArray);
        
        let headerTitle = this.nsoHeaderTitle + " BP Rev-1"
        this.apiService.addConfiguration(headerTitle, this.nsoCustomerID, this.nsoPlatformID, finalConfigurationArray).subscribe(response => {
        
          console.log("addConfiguration - response: ", JSON.parse(JSON.stringify(response)));

          this.router.navigate(['builder/configuration']);
        }, error => {
    
        });
    }
  }

  deltaReviewClick() {

    console.log("deltaReviewClick-getConfigurationDetailsArray",this.getConfigurationDetailsArray.configuration);
    console.log("deltaReviewClick-nsoConfigFecets",this.nsoConfigFecets);

    localStorage.setItem("currentConfiguration",JSON.stringify(this.getConfigurationDetailsArray.configuration));
    localStorage.setItem("newConfiguration",JSON.stringify(this.nsoConfigFecets));
    localStorage.setItem("G3platformID",this.nsoPlatformID);
    localStorage.setItem("customerID",this.nsoCustomerID);
    localStorage.setItem("NSOConfigName",this.nsoHeaderTitle);
    localStorage.setItem("ShowLocalNSOConfig", "1");

    this.router.navigate(['builder/nso-deltapage']);
  }

  clearAllValues() {

    this.nsoFormGroup.reset();
    this.chamberActionMessage = "delete";
    this.newChamber = "";
    this.newChamberGotCode = "";
    this.selectedChamberID = "";
    this.selectedNSOChamberFamilyItemName = "";
    this.selectedNSOChamberFamilytemID = "";
    this.selectedChamberGotCode = ""; 

    this.isReviewChangesButtonVisible = true;
    console.log("clearAllValues");
  }
  
  ReviewChanges() {

    console.log("ReviewChanges-this.currentChamber",this.currentChamber);
    console.log("ReviewChanges-this.currentChamberGotCode",this.currentChamberGotCode);
    console.log("ReviewChanges-this.newChamber",this.newChamber);
    console.log("ReviewChanges-this.newChamberGotCode",this.newChamberGotCode);
    
    const dialogRef = this.dialog.open(ReviewChangesDialog, {

      width: '1100px',
      height: '600px',
      data: {

        currentChamber: this.currentChamber,
        currentChamberGotCode: this.currentChamberGotCode,
        newChamber: this.newChamber,
        newChamberGotCode: this.newChamberGotCode,
        nsoSelectedFecetName:this.nsoSelectedFecetName,
        chamberActionMessage:this.chamberActionMessage,
      }
      // data: {deleteItem: configurationItem}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      if( localStorage.getItem("isChangesConfirm") == "true") {

        console.log("check - chamber -id",this.selectedChamberID);
        console.log("check - fecet name",this.nsoSelectedFecetName);
        console.log("check - nsoPlatformID",this.nsoPlatformID);
        console.log("check- configuration", this.nsoConfigFecets);

        let validateConfiguration = [];

        for( var i = 0; i < this.nsoConfigFecets.length; i++) {

          if (i == this.selectedNSOChamberIndexPosition) {

          } else {

            let validateConfig = {"chamberIds" : this.nsoConfigFecets[i].chamber_id, "facet_name" : this.nsoConfigFecets[i].facet_name};
            validateConfiguration.push(validateConfig);
          }
        }

        console.log("check- validateConfiguration", validateConfiguration);
      
        this.apiService.validateChamberCompatibiltyByPosition(this.selectedChamberID, this.nsoSelectedFecetName, this.nsoPlatformID, validateConfiguration).subscribe(response => {

          console.log("validateChamberCompatibiltyByPosition response", response);
          let validateResponse = JSON.parse(JSON.stringify(response));

          // if (validateResponse.sucess == false) {

          //   const dialogRef = this.dialog.open(ValidateMessageDialog, {
          //     width: '350px',
          //     height: '170px',
          //     data: {
          //       currentChamber: this.currentChamber,
          //       currentChamberGotCode: this.currentChamberGotCode,
          //       newChamber: this.newChamber,
          //       newChamberGotCode: this.newChamberGotCode,
          //       nsoSelectedFecetName:this.nsoSelectedFecetName,
          //       chamberActionMessage:this.chamberActionMessage,
          //     }
          //   });
      
          //   dialogRef.afterClosed().subscribe(result => {
        
          //     console.log(`DeleteConfigConfirmationDialog afterClosed result: ${result}`);
          //   });
          // } else {

            for( var i = 0; i < this.nsoConfigFecets.length; i++) {

              if (i == this.selectedNSOChamberIndexPosition) {
      
                this.nsoConfigFecets[i].chamber_name = this.newChamber;
                this.nsoConfigFecets[i].chamber_id = this.selectedChamberID;
    
                this.nsoConfigFecets[i].chamber_family_name = this.selectedNSOChamberFamilyItemName;
                this.nsoConfigFecets[i].chamber_family_id = this.selectedNSOChamberFamilytemID;
                
                this.nsoConfigFecets[i].got_code = this.selectedChamberGotCode;
              }
            }
          // }
        }, error => {
    
        });    

        this.nsoFormGroup.reset();

        document.getElementById("nsosidenavDrawer").style.width = "0%";
        this.loadSvgImage();
      
        console.log("final selectedFecet-nsoConfigFecets",this.nsoConfigFecets);
      
        this.disabledReviewDelta = false;
        this.disabledSaveClose = false;
      } else {

      }
    });
  }

  revertChamber() {

    console.log("revertChamber selectedFecetFamilyID", this.selectedFecetFamilyID);

    this.isReviewChangesButtonVisible = true;

    if (this.selectedFecetFamilyID == 0) {

      this.nsoFormGroup.reset();
    } else {
      
      this.apiService.getExplorerChamberFamilies(this.nsoPlatformID, this.nsoSelectedFecetName).subscribe(response => {

        this.nsoExplorerChambersFamily = JSON.parse(JSON.stringify(response));
  
        const toSelect = this.nsoExplorerChambersFamily.items.find(c => c.id == this.selectedFecetFamilyID);
  
        this.nsoFormGroup.get('formGroupChamberFamilyValue').setValue(toSelect);
        console.log("revertChamber-toFamilySelect", toSelect);
      }, error => {
  
      });
  
      if (this.isUpgradableRule == false) {

        let nsoChambersByFamilyID1:any = []; 
        this.apiService.getChambersByFamilyID(this.selectedFecetFamilyID).subscribe(response => {
    
          nsoChambersByFamilyID1 = JSON.parse(JSON.stringify(response));
          this.nsoChambersByFamilyID = nsoChambersByFamilyID1.items;
    
          console.log("revertChamber-getChambersByFamilyID: ", this.nsoChambersByFamilyID);
    
          const toChamberSelect = this.nsoChambersByFamilyID.find(c => c.id == this.selectedFecetChamberID);
          this.nsoFormGroup.get('formGroupChamberValue').setValue(toChamberSelect);
          console.log("revertChamber-toChamberSelect: ",toChamberSelect);
        }, error => {
    
        });
      } else {

        let nsoChambersByFamilyID1:any = []; 
        this.apiService.getPossibleUpgradeChambers(this.selectedFecetFamilyID, this.selectedFecetChamberID).subscribe(response => {

          this.nsoChambersByFamilyID = JSON.parse(JSON.stringify(response));
          console.log("viewDetailsClick-getPossibleUpgradeChambers",this.nsoChambersByFamilyID);

          const toChamberSelect = this.nsoChambersByFamilyID.find(c => c.id == this.selectedFecetChamberID);
          this.nsoFormGroup.get('formGroupChamberValue').setValue(toChamberSelect);
          console.log("viewDetailsClick-toChamberSelect",toChamberSelect);
        }, error => {

        });
      } 
    }
  }
}

@Component({

  selector: 'reviewChangesialog',
  templateUrl: 'ReviewChanges.html',
  styleUrls: ['./ReviewChanges.css'],
})

export class ReviewChangesDialog implements OnInit {

  currentChamber = "empty";
  currentChamberGotCode = "";
  newChamber = "empty;"
  newChamberGotCode = "";
  chamberActionMessage;
  nsoSelectedFecetName;

  constructor(public dialogRef: MatDialogRef<ReviewChangesDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public apiService: ApiService, private router: Router, private route: ActivatedRoute, private location: Location) {

    this.currentChamber = data.currentChamber;
    this.currentChamberGotCode = data.currentChamberGotCode;
    this.newChamber = data.newChamber;
    this.newChamberGotCode = data.newChamberGotCode;
    this.nsoSelectedFecetName = data.nsoSelectedFecetName;
    this.chamberActionMessage = data.chamberActionMessage;
  }

  ngOnInit() {

    console.log("dialog",this.currentChamber);
    console.log("dialog",this.newChamber);

    if(!this.currentChamber) {

      this.currentChamber = "empty";
    }

    if(this.newChamber == "") {

      this.chamberActionMessage = "delete";      
      this.newChamber = "empty";
    }
  }

  ReviewChangesClose() {

    localStorage.setItem("isChangesConfirm","false");
     this.dialogRef.close();
  }

  ConformChanges() {

    localStorage.setItem("isChangesConfirm","true");
    this.dialogRef.close();
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }
}

export class ColorModel {

  productName: string;
  productColor: string;
}

export interface DialogData {

  currentChamber;
  currentChamberGotCode;
  newChamber: string;
  newChamberGotCode
  nsoSelectedFecetName:any;
  chamberActionMessage:any;
}

@Component({

  selector: 'ValidateMessageDialog',
  templateUrl: 'ValidateMessageDialog.html',
  styleUrls: ['./ValidateMessageDialog.css'],
})

export class ValidateMessageDialog implements OnInit {

  currentChamber = "empty";
  currentChamberGotCode = "";
  newChamber = "empty;"
  newChamberGotCode = "";
  chamberActionMessage;
  nsoSelectedFecetName;

  constructor(public dialogRef: MatDialogRef<ValidateMessageDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {
     
    this.currentChamber = data.currentChamber;
    this.currentChamberGotCode = data.currentChamberGotCode;
    this.newChamber = data.newChamber;
    this.newChamberGotCode = data.newChamberGotCode;
    this.nsoSelectedFecetName = data.nsoSelectedFecetName;
    this.chamberActionMessage = data.chamberActionMessage;

    console.log("ValidateMessageDialog newChamber", this.newChamber);
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