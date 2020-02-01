import { Component, OnInit } from '@angular/core';
import { CoreDataPlatformService } from 'src/app/shared/core-data-platform.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-core-data-platform',
  templateUrl: './core-data-platform.component.html',
  styleUrls: ['./core-data-platform.component.css']
})
export class CoreDataPlatformComponent implements OnInit {


  imageURL: string = "";
  showSVGImage: boolean = false;
  uploadingFile : boolean = false;
  uploadedPercntValue : number = 0;

  constructor(public service : CoreDataPlatformService, 
    private uploadService : UploadService,
    private notificationService : NotificationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef : MatDialogRef<CoreDataPlatformComponent>) { }
    public saveAndAddNewTapped = false;
  
  
  ngOnInit() {

     this.loadModelSvg();
  }

  loadModelSvg()
  {
    this.showSVGImage = false;

    setTimeout(()=>{  
      
      this.imageURL = this.service.form.get('model_svg_url').value;
        console.log(" imageURL: ", this.imageURL);
        if(this.imageURL)
        {
          this.iconRegistry.addSvgIcon('modelSvgIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));
          this.showSVGImage = true;
        }
        else
        {
          this.showSVGImage = false;
        } 

    }, 0);

    
  }

  onFileChanged(event) {
    const selectedFile = event.target.files[0];
    console.log("selected file : ", selectedFile);

    if (event.target.files.length > 0) {

      this.uploadingFile = true;
      this.uploadService.uploadFile(selectedFile)
      .subscribe(event => {
        console.log(event); 
        if(event.type == HttpEventType.UploadProgress)
        {
            this.uploadedPercntValue =  (event.loaded / event.total) * 100;
        }
        else if(event.type == HttpEventType.Response)
        {

            const url = event.body["url"];
            const filename = event.body["filename"];
            console.log(`url = ${url}   filename = ${filename}`);
            this.service.form.get('model_svg_url').setValue(url);
            this.service.form.get('model_svg_filename').setValue(filename);
            
            this.uploadingFile = false;
            this.uploadedPercntValue = 0;

            this.loadModelSvg();
        }
        else if(event.type == HttpEventType.ResponseHeader)
        {
            this.uploadingFile = false;
            this.uploadedPercntValue = 0;
            console.log("headers : ", event.headers);
            if(event.status == 409)
            {
              this.notificationService.failure("model file needs to be an SVG");
            }
            
        }
        
      });
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
      console.log('this.service.form', this.service.form.value);
        if(this.service.form.get('id').value)
        {
          this.service.updatePlatform(this.service.form.value).subscribe(response => {

            console.log("Response - update platform : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertPlatform(this.service.form.value).subscribe(response => {

            console.log("Response - add new platform : ", response);
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
      this.service.insertPlatform(this.service.form.value).subscribe(response => {
        this.saveAndAddNewTapped = true;
        console.log("Response - add new platform : ", response);
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

  onlyNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  } 
  

}
