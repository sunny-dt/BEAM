import { FormControl } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocomplete, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { NotificationService } from 'src/app/shared/notification.service';
import { BuilderUpgradeRulesService } from 'src/app/shared/builder-upgrade-rules.service';

@Component({
  selector: 'app-upgrade-rules',
  templateUrl: './upgrade-rules.component.html',
  styleUrls: ['./upgrade-rules.component.css']
})

export class UpgradeRulesComponent implements OnInit {

  chambersList: any[] = [];
  chamberFamilyList: any = [];
  platformList: any = [];

  selectdChamberFamily;
  selectdPlatform;

  selectedchambersList: any[] = [];
  dropDownChamberFamilyList: any =[];
  dropDownchambersList: any[] = [];
  dropDownPlatformList: any =[];

  public term;

  removable = true;
  showSelectedchambersClearButton: boolean = false;
  chamberselectable = true;

  chamberFormControl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];

  disabledSaveButton = true;

  disabledPlatformInput = false;
  disabledChamberFamilyInput = false;

  @ViewChild('platoformNameInput') platoformNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('chamberFamilyNameInput') chamberFamilyNameInput: ElementRef<HTMLInputElement>;
  @ViewChild('chamberInput') chamberInput: ElementRef<HTMLInputElement>;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
    public builderUpgradeRulesService : BuilderUpgradeRulesService,
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<UpgradeRulesComponent>) {
  
    this.chamberFamilyList = [];  
    this.chambersList = [];
  }

  ngOnInit() {

    console.log('ngOnInit data ', this.data);

    this.builderUpgradeRulesService.getBuilderPlatforms().subscribe(response => {

      console.log('getBuilderPlatforms response ', response);
      this.platformList = JSON.parse(JSON.stringify(response));
      this.dropDownPlatformList = this.platformList;

      this.chambersList  = [];
      this.chamberFamilyList = [];  

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

    if (this.data.ruleID == "") {

      this.disabledPlatformInput = false;
      this.disabledChamberFamilyInput = false;
    } else {

      // this.builderUpgradeRulesService.getUpgradeChamberRulesByChamberFamilyID(this.data.dialogData.chamber_family_id).subscribe(response => {

      //   console.log('getUpgradeChamberRulesByChamberFamilyID response ', response);
      // });

      this.disabledPlatformInput = true;
      this.disabledChamberFamilyInput = true;

      this.platoformNameInput.nativeElement.value = this.data.dialogData.platform_family_name;
      this.chamberFamilyNameInput.nativeElement.value = this.data.dialogData.chamber_family_name;

      this.builderUpgradeRulesService.getBuilderChamberFamilies(this.data.dialogData.platform_family_id).subscribe(response => {

        console.log('getBuilderChamberFamilies response ', response);
        let chamberFamilyList = JSON.parse(JSON.stringify(response));

        this.chamberFamilyList = chamberFamilyList.items;
        this.dropDownChamberFamilyList = chamberFamilyList.items;
  
        console.log('getBuilderChamberFamilies dropDownChamberFamilyList ', this.dropDownChamberFamilyList);

        for (let i = 0; i < this.chamberFamilyList.length; i++) {

          if (this.chamberFamilyList[i].id == this.data.dialogData.chamber_family_id) {

            this.selectdChamberFamily = this.chamberFamilyList[i];
          }
        }
      });

      this.disabledSaveButton = true;

      this.builderUpgradeRulesService.getBuilderChambersByFamilyID(this.data.dialogData.chamber_family_id).subscribe(response => {

        console.log('getBuilderChambersByFamilyID response ', response);
        let chambersList = JSON.parse(JSON.stringify(response));

        this.chambersList = chambersList.items;
        this.dropDownchambersList = chambersList.items;

        for (let i = 0; i < this.chambersList.length; i++) {

          for (let j = 0; j < this.data.dialogData.ChamberId.length; j++) {

            if (this.chambersList[i].id == this.data.dialogData.ChamberId[j]) {

              this.selectedchambersList.push(this.chambersList[i]);
            }
          }
        }
        
        for (let i = 0; i < this.selectedchambersList.length; i++) {

          const index = this.chambersList.indexOf(this.selectedchambersList[i]);
          this.chambersList.splice(index, 1);
        }
  
        this.dropDownchambersList = [];
        this.dropDownchambersList = this.chambersList;

        console.log('getBuilderChambersByFamilyID dropDownchambersList ', this.dropDownchambersList);
      });
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

    console.log("selectedchambersList",this.selectedchambersList);

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
    this.chamberFormControl.setValue(null);
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

      this.chambersList = [];
      this.dropDownchambersList = [];
      this.selectedchambersList = [];

      this.disabledSaveButton = true;

      this.chamberFamilyNameInput.nativeElement.value = "";

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

  getChamberFamilyName(value) {

    console.log('getChamberFamilyName value ', value);

    const results = this.chamberFamilyList.filter(chambeFamily => chambeFamily.id == value);
    if (results.length) {

      this.selectdChamberFamily = results[0];

      this.chambersList = [];
      this.dropDownchambersList = [];
      this.selectedchambersList = [];

      this.disabledSaveButton = true;

      this.builderUpgradeRulesService.getBuilderChambersByFamilyID(value).subscribe(response => {

        console.log('getBuilderChambersByFamilyID response ', response);
        let chambersList = JSON.parse(JSON.stringify(response));

        this.chambersList = chambersList.items;
        this.dropDownchambersList = chambersList.items;
  
        console.log('getBuilderChambersByFamilyID dropDownchambersList ', this.dropDownchambersList);
      });

      return results[0].name;
    } else {
      return '';
    }
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  onSave() {

    console.log('onSave selectdPlatform ', this.selectdPlatform);
    console.log('onSave selectdChamberFamily ', this.selectdChamberFamily);
    console.log('onSave selectedchambersList ', this.selectedchambersList);

    let selectedchambersIDsList = [];
    for (let i = 0; i < this.selectedchambersList.length; i++) {

      selectedchambersIDsList.push(this.selectedchambersList[i].id);
    }

    if (this.data.ruleID == "") {

      this.builderUpgradeRulesService.addUpgradeChamberRules(this.selectdChamberFamily.id, selectedchambersIDsList, this.selectdPlatform.id).subscribe(response => {

        console.log('addUpgradeChamberRules response ', response);
        this.notificationService.success("Saved successfully");
        this.dialogRef.close(this.data);
      }, error => {
  
        this.notificationService.failure(error.error);
      });
    } else {

      this.builderUpgradeRulesService.updateUpgradeChamberRules(this.selectdChamberFamily.id, selectedchambersIDsList, this.selectdPlatform.id, this.data.ruleID,).subscribe(response => {

        console.log('addUpgradeChamberRules response ', response);
        this.notificationService.success("Saved successfully");
        this.dialogRef.close(this.data);
      }, error => {
  
        this.notificationService.failure(error.error);
      });
    }
  }

  onClose(data) {

    this.dialogRef.close(data);
  }
}