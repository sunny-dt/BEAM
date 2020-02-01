import { Location } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { ApiService } from 'src/app/Services/api.service';
import { AppComponent } from 'src/app/app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { IgxExcelExporterService, IgxExcelExporterOptions } from 'igniteui-angular';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/Services/excel.service';

@Component({
  
  selector: 'app-builder-nso-delta-review-page',
  templateUrl: './builder-nso-delta-review-page.component.html',
  styleUrls: ['./builder-nso-delta-review-page.component.css'],
})

export class BuilderNSODeltaReviewPageComponent implements OnInit {

  deltaReviewList : any = [];
  currentConfiguration : any = [];
  newConfiguration : any = [];
  configName = "";
  customerID = "8";
  platformID = "1";
  selectedCustomerName = "";

  constructor(public apiService:ApiService, private appComp: AppComponent, private location:Location, private router: Router, private route: ActivatedRoute, private excelExportService: IgxExcelExporterService, public dialog: MatDialog, private excelService: ExcelService) {
  }

  ngOnInit() {

    this.appComp.hide();
    console.log("ngOnInit currentConfiguration: ", JSON.parse(localStorage.getItem("currentConfiguration")));
    console.log("ngOnInit newConfiguration: ", JSON.parse(localStorage.getItem("newConfiguration")));
    console.log("ngOnInit g3platformID: ", localStorage.getItem("G3platformID"));
    console.log("ngOnInit customerID: ", localStorage.getItem("customerID"));
    console.log("ngOnInit nsoCOnfigName: ", localStorage.getItem("NSOConfigName"));

    this.platformID = localStorage.getItem("G3platformID");
    this.customerID = localStorage.getItem("customerID");
    this.configName = localStorage.getItem("NSOConfigName");

    this.currentConfiguration = JSON.parse(localStorage.getItem("currentConfiguration"));
    this.newConfiguration = JSON.parse(localStorage.getItem("newConfiguration"));

    this.selectedCustomerName = localStorage.getItem('selectedCustomerName');
    console.log("ngOnInit selectedCustomerName: ", localStorage.getItem("selectedCustomerName"));

    let deltaReviewChambersList = [];
    for (let i = 0; i < this.currentConfiguration.length; i++) {

      if (this.currentConfiguration[i].chamber_id == this.newConfiguration[i].chamber_id) {

      } else {

        console.log("ngOnInit currentConfiguration i: ", i);
        console.log("ngOnInit currentConfiguration i chagnes: ", this.currentConfiguration[i]);
        console.log("ngOnInit newConfiguration i chagnes: ", this.newConfiguration[i]);

        let facet_name = this.currentConfiguration[i].facet_name;
        let current_chamber_name = this.currentConfiguration[i].chamber_name;
        let new_chamber_name = this.newConfiguration[i].chamber_name;

        let current_chamber_got_code = this.currentConfiguration[i].gotCode;
        let new_chamber_got_code = this.newConfiguration[i].got_code;

        if (current_chamber_name == "") {
          current_chamber_name = "empty";
        }

        if (new_chamber_name == "") {
          new_chamber_name = "empty";
        }

        let deltaReviewChamber = {facet_name: facet_name, current_chamber_name: current_chamber_name, new_chamber_name: new_chamber_name,
          current_chamber_got_code: current_chamber_got_code, new_chamber_got_code: new_chamber_got_code};
        deltaReviewChambersList.push(deltaReviewChamber);
      }
    }

    this.deltaReviewList = [{name: 'CHAMBERS', values: deltaReviewChambersList},
    {name: 'PASSTHROUGHS', values: []},
    {name: 'FACTORY INTERFACE', values: []},
    {name: 'BUFFER CHAMBER', values: []},
    {name: 'TRANSFER CHAMBER', values: []},
    {name: 'SWLL', values: []},
    {name: 'REMOTES', values: []},
    {name: 'FEATURES', values: []}];

    console.log('final delta review deltaReviewList: ', this.deltaReviewList);
  }

  goToPreviousPage() {

    console.log('goToPreviousPage');
    this.location.back();
  }

  deltaReviewSubmit() {
    
    console.log('deltaReviewSubmit');

    let newConfigList = [];
    for (let i = 0; i < this.newConfiguration.length; i++) {

      let config_id = this.newConfiguration[i].config_id;
      let chamber_family_id = this.newConfiguration[i].chamber_family_id;
      let chamber_family_name = this.newConfiguration[i].chamber_family_name;
      let chamber_id = this.newConfiguration[i].chamber_id;
      let chamber_name = this.newConfiguration[i].chamber_name;
      let facet_name = this.newConfiguration[i].facet_name;
      let facet_id = "0";

      let newConfig = {
        chamber_family_id: chamber_family_id,
        chamber_family_name: chamber_family_name,
        chamber_id: chamber_id,
        chamber_name: chamber_name,
        facet_name: facet_name,
        facet_id: facet_id};

        newConfigList.push(newConfig);
    }

    console.log('deltaReviewSubmit newConfigList: ', newConfigList);
    this.apiService.addNSOConfiguration(this.configName, this.customerID, this.platformID, newConfigList).subscribe(response => {

      console.log("ApiService addNSOConfiguration response ", response);

      this.router.navigate(['builder/configuration']);
    }, error => {

    });
  }

  public displayGotCode(gotCode) {

    if (typeof gotCode!='undefined' && gotCode) {

      let gotCodeValue = "(" + gotCode + ")";
      return gotCodeValue;
    } else {
       
      return "";
    }
  }

  getDeltaReviewExportDataArray() {

    console.log("getDeltaReviewExportDataArray");

    let excelData = [];

    for (let i = 0; i < this.currentConfiguration.length; i++) {

      if (this.currentConfiguration[i].chamber_id == this.newConfiguration[i].chamber_id) {

      } else {

        console.log("getDeltaReviewExportDataArray currentConfiguration i: ", i);
        console.log("getDeltaReviewExportDataArray currentConfiguration i chagnes: ", this.currentConfiguration[i]);
        console.log("getDeltaReviewExportDataArray newConfiguration i chagnes: ", this.newConfiguration[i]);

        let facet_name = this.currentConfiguration[i].facet_name;
        let current_chamber_name = this.currentConfiguration[i].chamber_name;
        let new_chamber_name = this.newConfiguration[i].chamber_name;

        let current_chamber_got_code = this.currentConfiguration[i].gotCode;
        let new_chamber_got_code = this.newConfiguration[i].got_code;

        if (current_chamber_name == "") {
          current_chamber_name = "empty";
        }

        if (new_chamber_name == "") {
          new_chamber_name = "empty";
        }

        console.log("getDeltaReviewExportDataArray selectedCustomerName: ", this.selectedCustomerName);
        console.log("getDeltaReviewExportDataArray configName: ", this.configName);

        let excelDataObject = {"Configuration Name": this.configName, "Customer Name": this.selectedCustomerName, "Facet": "Chamber " + facet_name, "From": current_chamber_name + this.displayGotCode(current_chamber_got_code), "To": new_chamber_name + this.displayGotCode(new_chamber_got_code)};
        excelData.push(excelDataObject);
      }
    }

    console.log("getDeltaReviewExportDataArray excelData: ", excelData);

    return excelData;
  }

  deltaReviewExport() {

    let excelData = this.getDeltaReviewExportDataArray();
    console.log("deltaReviewExport excelData: ", excelData);

    this.excelExportService.exportData(excelData, new IgxExcelExporterOptions(this.configName + " - NSO Builder" ));
  }

  deltaReviewMail() {

    let excelData = this.getDeltaReviewExportDataArray();
    console.log("deltaReviewMail excelData: ", excelData);

    let excelServiceData = this.excelService.exportAsExcelFile(excelData);
    console.log("deltaReviewMail excelServiceData: ", excelServiceData);

    var reader = new FileReader();
    reader.onloadend = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(excelServiceData);
  }

  handleReaderLoaded(e) {

    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    const dialogRef = this.dialog.open(EMailTemplateDialog, {

      width: '800px',
      // height: '600px',
      data: {fileBase64Value: base64result}
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result == "success") {

        const dialogRef = this.dialog.open(EmailSentSuccessDialog, {

          width: '350px',
          // height: '600px'
        });
      }
    });
  }

  expnandExpansionPanel(postion) {

    if (postion == 0) {

      return true;
    } else {

      return false;
    }
  }
}

@Component({

  selector: 'EMailTemplate',
  templateUrl: 'EMailTemplate.html',
  styleUrls: ['./EMailTemplate.css'],
})

export class EMailTemplateDialog implements OnInit {

  emailFrom: string = "";
  emailSubjectFormControlName: string = "";

  emailTemplateForm: FormGroup;

  fileBase64Value;
  attachmentFileName = "";

  showErrorMessage = true;
  showProgressBar = true;

  constructor(public dialogRef: MatDialogRef<EMailTemplateDialog>, @Inject(MAT_DIALOG_DATA) public data: DialogData, public apiService: ApiService, private excelService: ExcelService) {

    this.fileBase64Value = data.fileBase64Value;
    console.log("ngOnInit constructor fileBase64Value", this.fileBase64Value);

    let userDetails = JSON.parse(localStorage.getItem('UserDetails'));
    console.log("ngOnInit localStorage userDetails", userDetails);

    this.emailFrom = userDetails.email;

    let configName = localStorage.getItem("NSOConfigName");
    let selectedCustomerName = localStorage.getItem('selectedCustomerName');

    this.emailSubjectFormControlName = configName + " - " + selectedCustomerName;
    console.log("ngOnInit emailSubjectFormControlName", this.emailSubjectFormControlName);

    this.attachmentFileName = configName + " - NSO Builder.xls";

    this.emailTemplateForm = new FormGroup({

      emailToFormControlName: new FormControl('', [Validators.required]),
      emailCCFormControlName: new FormControl(''),
      emailBCCFormControlName: new FormControl(''),
      emailSubjectFormControlName: new FormControl(this.emailSubjectFormControlName, [Validators.required]),
      emailBodyFormControlName: new FormControl('', [Validators.required]),
      emailAttachmentFormControlName: new FormControl('')
    });
  }

  ngOnInit() {

  }

  public filePicked(event) {    
    let fileList: FileList = event.target.files;

    if (fileList.length > 0) {

      const file: File = fileList[0];
      this.handleInputChange(file);
    }
  }

  handleInputChange(files) {
    var file = files;
    var reader = new FileReader();
    reader.onloadend = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    let reader = e.target;
    var base64result = reader.result.substr(reader.result.indexOf(',') + 1);

    console.log("_handleReaderLoaded", base64result);
  }

  onToInputChange(value): void {  
    console.log(value);

    this.showErrorMessage = true;
  }

  dailogSend() {

    console.log("dailogSend emailTemplateForm", this.emailTemplateForm);

    let emailToFormControlName = this.emailTemplateForm.value.emailToFormControlName
    console.log("dailogSend emailToFormControlName", emailToFormControlName);

    let toMails = emailToFormControlName.split(",");
    console.log("dailogSend toMails", toMails);

    let canSendMail = false;

    for (let i = 0; i < toMails.length; i++) {

      console.log("dailogSend toMail", toMails[i]);
      let mailID = toMails[i].split("@");

      console.log("dailogSend mailID", mailID[1]);

      if (mailID.length == 2) {
        
        if (mailID[1] == "amat.com") {

          this.showErrorMessage = true;
          canSendMail = true;
        } else {

          this.showErrorMessage = false;
          canSendMail = false;

          break;
        }
      } else {

        this.showErrorMessage = false;
        canSendMail = false;

        break;
      }
    }

    console.log("dailogSend canSendMail", canSendMail);

    if (canSendMail) {

      this.showProgressBar = false;

      let emailCC = this.emailTemplateForm.value.emailCCFormControlName;
      console.log("dailogSend emailCC", emailCC);

      let emailFormateBodyCC = [];

      if (emailCC == "") {
        
        emailFormateBodyCC = [];
      } else {
        
        emailFormateBodyCC.push(emailCC);
      }

      console.log("dailogSend emailFormateBodyCC", emailFormateBodyCC);

      let emailFormate = [
        {
          "from": this.emailFrom,
          "to": [this.emailTemplateForm.value.emailToFormControlName],
          "cc" : emailFormateBodyCC,
          "bcc" : [],
          "subject": this.emailTemplateForm.value.emailSubjectFormControlName,
          "body": this.emailTemplateForm.value.emailBodyFormControlName,
          "attachments": [{
            "filename": this.attachmentFileName,
            "base64_encoded": this.fileBase64Value
          }]
        }
      ];

      console.log("dailogSend emailFormate", emailFormate);

      this.apiService.sendMail(emailFormate).subscribe(response => {

        console.log("ApiService sendMail response ", response);

        this.dialogRef.close("success");
        this.showProgressBar = true;
      }, error => {

        this.showProgressBar = true;
      });
    } else {

      this.showProgressBar = true;
    }
  }

  dailogCancel() {

    this.dialogRef.close();
  }
}

export interface DialogData {

  fileBase64Value;
}

@Component({

  selector: 'email_sent_success_dialog',
  templateUrl: 'email_sent_success_dialog.html',
  styleUrls: ['email_sent_success_dialog.css'],
})

export class EmailSentSuccessDialog {

  constructor(public dialogRef: MatDialogRef<EmailSentSuccessDialog>) { 

  }

  dailogCancel(): void {
    this.dialogRef.close();
  }
}