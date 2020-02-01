import { Component, OnInit } from '@angular/core';
import { FacetService } from 'src/app/shared/facet.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-facet',
  templateUrl: './facet.component.html',
  styleUrls: ['./facet.component.css']
})
export class FacetComponent implements OnInit {

  constructor(public service : FacetService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<FacetComponent>) { }

    public saveAndAddNewTapped = false;

  ngOnInit() {
  }

  onClear()
  {
    this.saveAndAddNewTapped = false;
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
          this.service.updateFacet(this.service.form.value).subscribe(response => {

            console.log("Response - update facet : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertFacet(this.service.form.value).subscribe(response => {

            this.saveAndAddNewTapped = false;
            console.log("Response - add new facet : ", response);
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
      this.service.insertFacet(this.service.form.value).subscribe(response => {

        this.saveAndAddNewTapped = true;
        console.log("Response - add new facet : ", response);
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
