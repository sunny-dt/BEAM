import { Component, OnInit } from '@angular/core';
 
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef } from '@angular/material';
import { CoreDataChamberFamiliesService } from 'src/app/shared/core-data-chambers-families.service';

@Component({
  selector: 'app-core-data-chamber-family',
  templateUrl: './core-data-chamber-family.component.html',
  styleUrls: ['./core-data-chamber-family.component.css']
})
export class CoreDataChamberFamilyComponent implements OnInit {

  constructor(public service : CoreDataChamberFamiliesService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<CoreDataChamberFamilyComponent>) { }
    public saveAndAddNewTapped = false;
  ngOnInit() {
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

  
}
