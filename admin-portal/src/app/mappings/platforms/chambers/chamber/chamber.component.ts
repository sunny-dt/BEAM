import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ChamberService } from 'src/app/shared/chamber.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BuilderUpgradeRulesService } from 'src/app/shared/builder-upgrade-rules.service';

@Component({
  selector: 'app-chamber',
  templateUrl: './chamber.component.html',
  styleUrls: ['./chamber.component.css']
})
export class ChamberComponent implements OnInit {

  chamberFamilyDropDownList:any =[];
  chamberFamilyList: any = [];
  chamberDropDownList:any =[];
  chamberList: any = [];

  showClearButton: boolean = false;

  @ViewChild('chamber') private _enterChamber: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public builderUpgradeRulesService : BuilderUpgradeRulesService,
    public service : ChamberService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<ChamberComponent>) { }
    public saveAndAddNewTapped = false;

  ngOnInit() {


    console.log('ngOnInit platform_family_id ', this.service.platformId);
    
    this.builderUpgradeRulesService.getBuilderChamberFamilies(this.service.platformId).subscribe(response => {

      console.log('getBuilderChamberFamilies response ', response);
      let chamberFamilyList = JSON.parse(JSON.stringify(response));

      this.chamberFamilyList = chamberFamilyList.items;
      this.chamberFamilyDropDownList = chamberFamilyList.items;

      console.log('getBuilderChamberFamilies dropDownChamberFamilyList ', this.chamberFamilyDropDownList);
    });
  }

  onChamberFamilyKeyPress(event:any) {

    this.clearShowCondition();

    this._enterChamber.nativeElement.value= '';

    this.chamberFamilyDropDownList = [];

    for (var i = 0; i < this.chamberFamilyList.length; i++) {

      if (this.chamberFamilyList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.chamberFamilyDropDownList.push(this.chamberFamilyList[i]);
      }
    }
  }

  chamberFamilyClick(chamberFamily) {

    this.showClearButton = true;

    this._enterChamber.nativeElement.value= '';

    console.log('chamberFamilyClick chamberFamily', chamberFamily);
    this.service.form.value.chamber_family_id = chamberFamily.id;
    
    this.builderUpgradeRulesService.getBuilderChambersByFamilyID(chamberFamily.id).subscribe(response => {

      console.log('getBuilderChambersByFamilyID response ', response);
      let chambersList = JSON.parse(JSON.stringify(response));

      this.chamberList = chambersList.items;
      this.chamberDropDownList = chambersList.items;
    });
  }

  onChamberKeyPress(event:any) {

    this.clearShowCondition();

    this.chamberDropDownList = [];

    for (var i = 0; i < this.chamberList.length; i++) {

      if (this.chamberList[i].name.toLowerCase().includes(event.target.value.toLowerCase())) {
        
        this.chamberDropDownList.push(this.chamberList[i]);
      }
    }
  }
  chamberClick(chamber) {

    this.showClearButton = true;

    console.log('checking chamber', chamber);
    this.service.form.value.name = chamber.name;
    this.service.form.value.id = "";
    this.service.form.value.got_code = chamber.gotCode;
  }

  clearShowCondition() {
    if ( this.service.form.value.chamber_family_id !== '' || this.service.form.value.name !== '') {
      this.showClearButton = true;
    } else {
      this.showClearButton = false;
    }
  }

  onClear()
  {
    this.service.form.reset();
  }

  onCancel()
  {
    if(this.saveAndAddNewTapped)
      this.onClose('created');
    else
      this.onClose(null);
  }

  onSubmit()
  {
    if(this.service.form.valid)
    {
        if(this.service.form.get('id').value)
        {
          this.service.updateChamber(this.service.form.value).subscribe(response => {

            console.log("Response - update chamber : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertChamber(this.service.form.value).subscribe(response => {

            console.log("Response - add new chamber : ", response);
            this.notificationService.success("Saved successfully");
            this.onClose('created');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }

     
    }
  }

  onSubmitnAddNew()
  {
    if(this.service.form.valid)
    {
      this.service.insertChamber(this.service.form.value).subscribe(response => {

        this.saveAndAddNewTapped = true;
        console.log("Response - add new chamber : ", response);
        this.notificationService.success("Saved successfully");
        this.service.form.reset();
        
      }, error => {

        this.notificationService.failure(error.error);
      });
    }
  }

  onClose(data)
  {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close(data);
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
