import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MetadataMediaService } from 'src/app/shared/metadata-media.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef, MatIconRegistry } from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';
import { UploadService } from 'src/app/shared/upload.service';
import { HttpEventType } from '@angular/common/http';
import { timeout } from 'rxjs/operators';


@Component({
  selector: 'app-metadata-media-form',
  templateUrl: './metadata-media-form.component.html',
  styleUrls: ['./metadata-media-form.component.css']
})
export class MetadataMediaFormComponent implements OnInit {


  imageURL: string = "";
  showMetadataMediaImage: boolean = false;
  uploadingFile : boolean = false;
  uploadedPercntValue : number = 0;

  linkableMediaTypes = [{name : 'image', types_allowed : ['png', 'jpg']}, {name : 'video', types_allowed : ['mp4']}, {name : 'ppt', types_allowed:['ppt']}, {name : 'doc', types_allowed : ['doc', 'docx']}, {name : 'excel', types_allowed : ['xls', 'xlsx']}, {name : 'pdf', types_allowed : ['pdf']}];
  
  selectedLinkableMediaType : any = null;

  

  constructor(public service : MetadataMediaService, 
    private uploadService : UploadService,
    private notificationService : NotificationService,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef : MatDialogRef<MetadataMediaFormComponent>) { }
    public saveAndAddNewTapped = false;
  
  
  ngOnInit() {

     
    this.loadMetadataMediaImage();
    
  }

  ngAfterViewInit(){

    
  }

  loadMetadataMediaImage()
  {
    this.showMetadataMediaImage = false;

    setTimeout(()=>{  
      

      const media_type = this.service.form.get('media_type').value
      if(media_type)
      {
          this.selectedLinkableMediaType = media_type;
      }

      this.imageURL = this.service.form.get('media_file_url').value;
        console.log(" imageURL: ", this.imageURL);
        if(this.imageURL)
        {
          //this.iconRegistry.addSvgIcon('modelSvgIcon', this.sanitizer.bypassSecurityTrustResourceUrl(this.imageURL));
          this.showMetadataMediaImage = true;
        }
        else
        {
          this.showMetadataMediaImage = false;
        } 

    }, 0);

    
  }

 

  onLinkableMediaTypesSelectionChange(value)
  {
    this.service.form.patchValue({media_file_url : null, media_filename : null})
    console.log("selected value mat-select1",value);
    if(value != null)
    {
        this.selectedLinkableMediaType  = value;  
    }

    this.loadMetadataMediaImage();
  }

 
  

  onFileChanged(event) {
    const selectedFile = event.target.files[0];
    console.log("selected file : ", selectedFile);

    this.uploadingFile = true;
    this.uploadService.uploadRecommendedFile(selectedFile,this.selectedLinkableMediaType)
    .subscribe( (event) => {
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
          this.service.form.get('media_file_url').setValue(url);
          this.imageURL = this.service.form.get('media_file_url').value;
          this.service.form.get('media_filename').setValue(filename);
          
          this.uploadingFile = false;
          this.uploadedPercntValue = 0;

          this.loadMetadataMediaImage();
          console.log('service.form ->', this.service.form);
      }
      else if(event.type == HttpEventType.ResponseHeader)
      {
          this.uploadingFile = false;
          this.uploadedPercntValue = 0;
          //console.log("event : ", event);
          // if(event.status == 409)
          // {
          //   console.log(JSON.stringify(event));
          //   this.notificationService.failure("model file needs to be a PNG");
          // }
          
      }
      
    },
    (error) => {
      const errorMsg = error.error.error.message;
      console.log("upload error ", errorMsg);
      this.notificationService.failure(errorMsg);
    });

  }

  onClear()
  {
    this.imageURL = null;
    this.selectedLinkableMediaType = null;

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
          this.service.updateMetadataMedia(this.service.form.value).subscribe(response => {

            console.log("Response - update metadata-media-form : ", response);
            this.notificationService.success("Updated successfully");
            this.onClose('edited');
            
          }, error => {
    
            this.notificationService.failure(error.error);
          });
        }
        else
        {
          this.service.insertMetadataMedia(this.service.form.value).subscribe(response => {

            console.log("Response - add new metadata-media-form : ", response);
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
      this.service.insertMetadataMedia(this.service.form.value).subscribe(response => {
        this.saveAndAddNewTapped = true;
        console.log("Response - add new metadata-media-form : ", response);
        this.notificationService.success("Saved successfully");
        this.imageURL = null;
        this.selectedLinkableMediaType = null;
        
        this.service.form.reset();
        
      }, error => {

        this.notificationService.failure(error.error);
      });
    }
  }

  onClose(data)
  {
    this.imageURL = null;
    this.selectedLinkableMediaType = null;

    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close(data);
  }

  

}
