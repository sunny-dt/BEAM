import { CoreDataChamberService } from 'src/app/shared/core-data-chamber.service';
import { Component, OnInit, Inject } from '@angular/core';
import { ChamberService } from 'src/app/shared/chamber.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-core-data-chamber',
  templateUrl: './core-data-chamber.component.html',
  styleUrls: ['./core-data-chamber.component.css']
})
export class CoreDataChamberComponent implements OnInit {

  platformID;
  chamber_family_id;

  constructor( @Inject(MAT_DIALOG_DATA) public data: any,
      public service : CoreDataChamberService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<CoreDataChamberComponent>) { }
    public saveAndAddNewTapped = false;
  ngOnInit() {

    console.log('ngOnInit data ', this.data);

    this.platformID = this.data.PlatformID;
    this.chamber_family_id = this.data.ChamberFamilyID;

    console.log('ngOnInit platformID ', this.platformID);
    console.log('ngOnInit chamber_family_id ', this.chamber_family_id);
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
          this.service.updateChamber(this.service.form.value, this.chamber_family_id).subscribe(response => {

            console.log("Response - update chamber : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertChamber(this.service.form.value, this.platformID, this.chamber_family_id).subscribe(response => {

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
      this.service.insertChamber(this.service.form.value,  this.platformID, this.chamber_family_id).subscribe(response => {

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

  
}
