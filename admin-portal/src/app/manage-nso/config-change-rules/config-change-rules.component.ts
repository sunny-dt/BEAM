import { FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotificationService } from 'src/app/shared/notification.service';
import { BuilderUpgradeRulesService } from 'src/app/shared/builder-upgrade-rules.service';
import { BuilderConfigChangeRulesService } from 'src/app/shared/builder-config-change-rules.service';

@Component({
  selector: 'app-config-change-rules',
  templateUrl: './config-change-rules.component.html',
  styleUrls: ['./config-change-rules.component.css']
})

export class ConfigChangeRulesComponent implements OnInit {

  platformList: any = [];
  chamberFamilyList: any = [];
  chambersList: any[] = [];

  selectdPlatform;

  dropDownPlatformList: any =[];
  selectedChamberFamilyList: any[] = [];
  dropDownChamberFamilyList: any =[];
  dropDownchambersList: any[] = [];
  selectedchambersList: any[] = [];

  public term;

  removable = true;
  showSelectedchambersClearButton: boolean = false;
  showSelectedchamberFamilyClearButton: boolean = false;

  chamberselectable = true;

  disabledSaveButton = true;

  disabledPlatformInput = false;
  disabledChamberFamilyInput = false;

  @ViewChild('platoformNameInput') platoformNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('chamberFamilyInput') chamberFamilyInput: ElementRef<HTMLInputElement>;
  @ViewChild('chamberInput') chamberInput: ElementRef<HTMLInputElement>;

  public backgroundColorCodes = [
    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",
    "#4D4599C3", "#4DE87722", "#4D6244BB", "#FFCD00", "#84BD00", "#4D00B5E2", "#4D53565A", "#4D888B8D", "#4DD9D9D6", "#4D99D6EA", "#4DD22630",
    "#804599C3", "#80E87722", "#806244BB", "#FFCD00", "#84BD00", "#8000B5E2", "#8053565A", "#80888B8D", "#80D9D9D6", "#8099D6EA", "#80D22630",
    "#4599C3", "#E87722", "#6244BB", "#FFCD00", "#84BD00", "#00B5E2", "#53565A", "#888B8D", "#D9D9D6", "#99D6EA", "#D22630",
  ];

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    public builderUpgradeRulesService : BuilderUpgradeRulesService,
    public builderConfigChangeRulesService : BuilderConfigChangeRulesService,
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<ConfigChangeRulesComponent>) {
  
    this.chamberFamilyList = [];  
    this.chambersList = [];

    this.selectedChamberFamilyList = [];
    this.dropDownChamberFamilyList = [];
    this.dropDownchambersList = [];
    this.selectedchambersList = [];
  }

  ngOnInit(){

    console.log('ngOnInit data ', this.data);

    this.builderUpgradeRulesService.getBuilderPlatforms().subscribe(response => {

      console.log('getBuilderPlatforms response ', response);
      this.platformList = JSON.parse(JSON.stringify(response));
      this.dropDownPlatformList = this.platformList;

      this.chamberFamilyList = [];  
      this.chambersList  = [];

      this.selectedChamberFamilyList = [];
      this.dropDownChamberFamilyList = [];
      this.dropDownchambersList = [];
      this.selectedchambersList = [];

      console.log('getBuilderPlatforms dropDownPlatformList ', this.dropDownPlatformList);

      if (this.data.ruleID == "") {
      } else {

        for (let i = 0; i < this.platformList.length; i++) {

          if (this.platformList[i].id == this.data.dialogData.platform_family_id) {
  
            this.selectdPlatform = this.platformList[i];
          }
        }
      }
    });

    console.log('getBuilderPlatforms dialogData ', this.data.dialogData);
    console.log('getBuilderPlatforms ruleID ', this.data.ruleID);

    // if (this.data.ruleID == "") {

    //   this.disabledPlatformInput = false;
    //   this.disabledChamberFamilyInput = false;
    // } else {

    //   // this.builderUpgradeRulesService.getUpgradeChamberRulesByChamberFamilyID(this.data.dialogData.chamber_family_id).subscribe(response => {

    //   //   console.log('getUpgradeChamberRulesByChamberFamilyID response ', response);
    //   // });

    //   this.disabledPlatformInput = true;
    //   this.disabledChamberFamilyInput = true;

    //   this.platoformNameInput.nativeElement.value = this.data.dialogData.platform_family_name;
    //   this.chamberFamilyNameInput.nativeElement.value = this.data.dialogData.chamber_family_name;

    //   this.builderUpgradeRulesService.getBuilderChamberFamilies(this.data.dialogData.platform_family_id).subscribe(response => {

    //     console.log('getBuilderChamberFamilies response ', response);
    //     let chamberFamilyList = JSON.parse(JSON.stringify(response));

    //     this.chamberFamilyList = chamberFamilyList.items;
    //     this.dropDownChamberFamilyList = chamberFamilyList.items;
  
    //     console.log('getBuilderChamberFamilies dropDownChamberFamilyList ', this.dropDownChamberFamilyList);

    //     for (let i = 0; i < this.chamberFamilyList.length; i++) {

    //       if (this.chamberFamilyList[i].id == this.data.dialogData.chamber_family_id) {

    //         this.selectdChamberFamily = this.chamberFamilyList[i];
    //       }
    //     }
    //   });

    //   this.disabledSaveButton = true;

    //   this.builderUpgradeRulesService.getBuilderChambersByFamilyID(this.data.dialogData.chamber_family_id).subscribe(response => {

    //     console.log('getBuilderChambersByFamilyID response ', response);
    //     let chambersList = JSON.parse(JSON.stringify(response));

    //     this.chambersList = chambersList.items;
    //     this.dropDownchambersList = chambersList.items;

    //     for (let i = 0; i < this.chambersList.length; i++) {

    //       for (let j = 0; j < this.data.dialogData.ChamberId.length; j++) {

    //         if (this.chambersList[i].id == this.data.dialogData.ChamberId[j]) {

    //           this.selectedchambersList.push(this.chambersList[i]);
    //         }
    //       }
    //     }
        
    //     for (let i = 0; i < this.selectedchambersList.length; i++) {

    //       const index = this.chambersList.indexOf(this.selectedchambersList[i]);
    //       this.chambersList.splice(index, 1);
    //     }
  
    //     this.dropDownchambersList = [];
    //     this.dropDownchambersList = this.chambersList;

    //     console.log('getBuilderChambersByFamilyID dropDownchambersList ', this.dropDownchambersList);
    //   });
    // }
  }

  chamberFamilyRemove(chamberFamily: string): void {

    const index = this.selectedChamberFamilyList.indexOf(chamberFamily);
    this.chamberFamilyList.push(this.selectedChamberFamilyList[index]);
    
    this.selectedChamberFamilyList.splice(index, 1);
    console.log("selectedchamberFamilyList", this.selectedChamberFamilyList);
    if(this.selectedChamberFamilyList.length > 0) {

      this.showSelectedchamberFamilyClearButton = true;
    } else {

      this.showSelectedchamberFamilyClearButton = false;
    }

    this.getChambersByFamilyID();
  }

  chamberFamilyOnClick(chamberFamily) {

    chamberFamily.color = this.setBackgroundForChamberFamily();

    console.log('chambersOnClick', chamberFamily);
    this.selectedChamberFamilyList.push(chamberFamily);

    const index = this.chamberFamilyList.indexOf(chamberFamily);

    this.chamberFamilyList.splice(index, 1);

    console.log("selectedChamberFamilyList",this.selectedChamberFamilyList);
    
    if(this.selectedChamberFamilyList.length > 0) {

      this.showSelectedchamberFamilyClearButton = true;
    } else {

      this.showSelectedchamberFamilyClearButton = false;
    }

    this.getChambersByFamilyID();
  }

  chamberFamilyOptionSelected(event) {

    event.option.value.color = this.setBackgroundForChamberFamily();
    this.selectedChamberFamilyList.push(event.option.value);

    console.log("chamberFamilyOptionSelected selectedChamberFamilyList ", this.selectedChamberFamilyList);

    const index = this.chamberFamilyList.indexOf(event.option.value);
    this.chamberFamilyList.splice(index, 1);

    if(this.selectedChamberFamilyList.length > 0) {

      this.showSelectedchamberFamilyClearButton = true;
    } else {

      this.showSelectedchamberFamilyClearButton = false;
    }

    // this.dropDownChamberFamilyList = [];
    this.chamberFamilyInput.nativeElement.value = '';

    this.getChambersByFamilyID();
  }

  clearAllSelectedchamberFamily() {

    for (let i = 0; i < this.selectedChamberFamilyList.length; i++) {

      this.chamberFamilyList.push(this.selectedChamberFamilyList[i]);
    }

    this.selectedChamberFamilyList = [];
    
    this.dropDownChamberFamilyList = this.chamberFamilyList;
    this.showSelectedchamberFamilyClearButton = false;
    this.disabledSaveButton = true;

    console.log("clearAllSelectedchambers",this.selectedChamberFamilyList);

    this.chambersList = [];
    this.dropDownchambersList = [];
    this.selectedchambersList = [];
  }

  onChambersKeyPress(event:any) {

    this.dropDownchambersList = [];

    for (var i = 0; i < this.chambersList.length; i++) {

      if (this.chambersList[i].name.toLowerCase().includes(event.target.value.toLowerCase()) || this.chambersList[i].gotCode.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownchambersList.push(this.chambersList[i]);
      }
    }
  }

  onChamberFamilyKeyPress(event:any) {

    this.dropDownChamberFamilyList = [];

    for (var i = 0; i < this.chamberFamilyList.length; i++) {

      if (this.chamberFamilyList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownChamberFamilyList.push(this.chamberFamilyList[i]);
      }
    }
  }

  onPlatformtKeyPress(event:any) {

    this.dropDownPlatformList = [];

    for (var i = 0; i < this.platformList.length; i++) {

      if (this.platformList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.dropDownPlatformList.push(this.platformList[i]);
      }
    }
  }

  getPlatformName(value) {

    console.log('getPlatformName value ', value);

    const results = this.platformList.filter(platform => platform.id == value);
    if (results.length) {

      this.selectdPlatform = results[0];

      this.chamberFamilyList = [];
      this.dropDownChamberFamilyList = [];
      this.selectedChamberFamilyList = [];

      this.chambersList = [];
      this.dropDownchambersList = [];
      this.selectedchambersList = [];

      this.disabledSaveButton = true;

      this.chamberFamilyInput.nativeElement.value = "";

      this.builderUpgradeRulesService.getBuilderChamberFamilies(value).subscribe(response => {

        console.log('getBuilderChamberFamilies response ', response);
        let chamberFamilyList = JSON.parse(JSON.stringify(response));

        this.chamberFamilyList = chamberFamilyList.items;
        this.dropDownChamberFamilyList = chamberFamilyList.items;
  
        console.log('getBuilderChamberFamilies dropDownChamberFamilyList ', this.dropDownChamberFamilyList);
      });

      return results[0].name;
    } else {
      return '';
    }
  }

  chambersRemove(chamber: string): void {

    const index = this.selectedchambersList.indexOf(chamber);
    this.chambersList.push(this.selectedchambersList[index]);
    
    this.selectedchambersList.splice(index, 1);
    console.log("selectedchambersList",this.selectedchambersList);
    if(this.selectedchambersList.length > 0) {

      this.showSelectedchambersClearButton = true;
      this.disabledSaveButton = false;
    } else {

      this.showSelectedchambersClearButton = false;
      this.disabledSaveButton = true;
    }
  }

  chambersOnClick(chamber) {

    console.log('chambersOnClick', chamber);
    this.selectedchambersList.push(chamber);

    const index = this.chambersList.indexOf(chamber);
    this.chambersList.splice(index, 1);

    console.log("selectedchambersList",this.selectedchambersList);
    
    if(this.selectedchambersList.length > 0) {

      this.showSelectedchambersClearButton = true;
      this.disabledSaveButton = false;
    } else {

      this.showSelectedchambersClearButton = false;
      this.disabledSaveButton = true;
    }
  }

  chamberOptionSelected(event) {

    console.log("chamberOptionSelected selectedchambersList ",this.selectedchambersList);

    this.selectedchambersList.push(event.option.value);

    const index = this.chambersList.indexOf(event.option.value);
    this.chambersList.splice(index, 1);

    if(this.selectedchambersList.length > 0) {

      this.showSelectedchambersClearButton = true;
      this.disabledSaveButton = false;
    } else {

      this.showSelectedchambersClearButton = false;
      this.disabledSaveButton = true;
    }

    // this.dropDownchambersList = [];
    this.chamberInput.nativeElement.value = '';
  }

  clearAllSelectedchambers() {

    for (let i = 0; i < this.selectedchambersList.length; i++) {

      this.chambersList.push(this.selectedchambersList[i]);
    }

    this.selectedchambersList = [];
    
    this.showSelectedchambersClearButton = false;
    this.disabledSaveButton = true;

    console.log("clearAllSelectedchambers",this.selectedchambersList);
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  tempChambersList: any = [];
  getChambersByFamilyID() {

    console.log('getChambersByFamilyID selectedChamberFamilyList ', this.selectedChamberFamilyList);

    this.chambersList = [];
    this.dropDownchambersList = [];
    this.selectedchambersList = [];
    
    this.tempChambersList = [];

    for (let i = 0; i < this.selectedChamberFamilyList.length; i++) {

      this.builderUpgradeRulesService.getBuilderChambersByFamilyID(this.selectedChamberFamilyList[i].id).subscribe(response => {

        console.log('getBuilderChambersByFamilyID response ', response);
        this.tempChambersList = JSON.parse(JSON.stringify(response));

        for (let j = 0; j < this.tempChambersList.items.length; j++) {

          this.tempChambersList.items[j].color = this.selectedChamberFamilyList[i].color;
          this.tempChambersList.items[j].familyId = this.selectedChamberFamilyList[i].id;
          this.chambersList.push(this.tempChambersList.items[j]);
        }

        this.dropDownchambersList = [];
        this.dropDownchambersList = this.chambersList;
  
        console.log('getBuilderChambersByFamilyID chambersList ', this.chambersList);
        console.log('getBuilderChambersByFamilyID dropDownchambersList ', this.dropDownchambersList);
      });
    }
  }

  onSave() {

    console.log('onSave selectdPlatform ', this.selectdPlatform);
    console.log('onSave selectedChamberFamilyList ', this.selectedChamberFamilyList);
    console.log('onSave selectedchambersList ', this.selectedchambersList);

    let chamberfamilies = [];
    for (let i = 0; i < this.selectedChamberFamilyList.length; i++) {

      let chamberfamilyObject = {
        "chamberfamilyId" : this.selectedChamberFamilyList[i].id,
        "chamberIds" : []
      }

      for (let j = 0; j < this.selectedchambersList.length; j++) {

        if (this.selectedChamberFamilyList[i].id == this.selectedchambersList[j].familyId) {

          chamberfamilyObject.chamberIds.push(this.selectedchambersList[j].id);
        }
      }

      console.log('onSave chamberfamilyObject ', chamberfamilyObject);
      chamberfamilies.push(chamberfamilyObject);
    }

    console.log('onSave chamberfamilies ', chamberfamilies);
    if (this.data.ruleID == "") {

      this.builderConfigChangeRulesService.addConfigChangeChamberRules(this.selectdPlatform.id, chamberfamilies).subscribe(response => {

        console.log('addUpgradeChamberRules response ', response);
        this.notificationService.success("Saved successfully");
        this.dialogRef.close(this.data);
      }, error => {
  
        this.notificationService.failure(error.error);
      });
    } else {

      // this.builderUpgradeRulesService.updateUpgradeChamberRules(this.selectdChamberFamily.id, selectedchambersIDsList, this.selectdPlatform.id, this.data.ruleID,).subscribe(response => {

      //   console.log('addUpgradeChamberRules response ', response);
      //   this.notificationService.success("Saved successfully");
      //   this.dialogRef.close(this.data);
      // }, error => {
  
      //   this.notificationService.failure(error.error);
      // });
    }
  }

  onClose(data) {

    this.dialogRef.close(data);
  }

  setBackgroundForChamberFamily() {

    console.log('setBackgroundForChamberFamily selectedChamberFamilyList ', this.selectedChamberFamilyList);
    
    let index = this.selectedChamberFamilyList.length;
    console.log('setBackgroundForChamberFamily index ', index);

    return this.backgroundColorCodes[index];
  }
}