import { Component, OnInit } from '@angular/core';
import { G2ProductService } from 'src/app/shared/g2-product.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-g2product',
  templateUrl: './g2-product.component.html',
  styleUrls: ['./g2-product.component.css']
})
export class G2ProductComponent implements OnInit {

  constructor(public service : G2ProductService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<G2ProductComponent>) { }

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
          this.service.updateG2Product(this.service.form.value).subscribe(response => {

            console.log("Response - update g2product : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertG2Product(this.service.form.value).subscribe(response => {

            this.saveAndAddNewTapped = false;
            console.log("Response - add new g2product : ", response);
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
      this.service.insertG2Product(this.service.form.value).subscribe(response => {

        this.saveAndAddNewTapped = true;
        console.log("Response - add new g2product : ", response);
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
