import { Component, OnInit } from '@angular/core';
import { MenuNodeTypeService } from 'src/app/shared/menu-node-type.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-menu-node-type-form',
  templateUrl: './menu-node-type-form.component.html',
  styleUrls: ['./menu-node-type-form.component.css']
})
export class MenuNodeTypeFormComponent implements OnInit {


  constructor(public service : MenuNodeTypeService, 
    private notificationService : NotificationService,
    public dialogRef : MatDialogRef<MenuNodeTypeFormComponent>) { }
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
          this.service.updateMenuNodeType(this.service.form.value).subscribe(response => {

            console.log("Response - update menunodetype : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertMenuNodeType(this.service.form.value).subscribe(response => {

            console.log("Response - add new menunodetype : ", response);
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
      this.service.insertMenuNodeType(this.service.form.value).subscribe(response => {
        this.saveAndAddNewTapped = true;
        console.log("Response - add new menunodetype : ", response);
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
