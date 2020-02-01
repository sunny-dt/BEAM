import { Component, OnInit } from '@angular/core';
import { NodeTypeAttributeNameService } from 'src/app/shared/node-type-attribute-name.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef } from '@angular/material';
import { MetadataAttrTypeService } from 'src/app/shared/metadata-attr-type.service';

@Component({
  selector: 'app-node-type-attribute-name-form',
  templateUrl: './node-type-attribute-name-form.component.html',
  styleUrls: ['./node-type-attribute-name-form.component.css']
})
export class NodeTypeAttributeNameFormComponent implements OnInit {

  constructor(public service: NodeTypeAttributeNameService,
    private notificationService: NotificationService,
    private metadataAttrTypeService: MetadataAttrTypeService,
    public dialogRef: MatDialogRef<NodeTypeAttributeNameFormComponent>) { }

  public saveAndAddNewTapped = false;
  public attrTypes = [];

  ngOnInit() {
    this.loadMetadataAttrTypes();
  }


  loadMetadataAttrTypes() {

    this.metadataAttrTypeService.getMetadataAttrTypes().subscribe(metadataAttrTypes => {

      this.attrTypes = metadataAttrTypes;

      this.service.populateForm(this.service.form.value);

    });
  }


  onClear() {
    this.saveAndAddNewTapped = false;
    this.service.form.reset();
  }

  onCancel() {
    if (this.saveAndAddNewTapped)
      this.onClose('created');
    else
      this.onClose(null);
  }

  onSubmit() {
    if (this.service.form.valid) {
      if (this.service.form.get('id').value) {
        this.service.updateNodeTypeAttributeName(this.service.form.value).subscribe(response => {

          console.log("Response - update node type attribute name : ", response);
          this.notificationService.success("Updated successfully");
          this.onClose('edited');

        }, error => {

          this.notificationService.failure(error.error);
        });
      }
      else {
        this.service.insertNodeTypeAttributeName(this.service.form.value).subscribe(response => {

          this.saveAndAddNewTapped = false;
          console.log("Response - add new node type attribute name : ", response);
          this.notificationService.success("Saved successfully");
          this.onClose('created');

        }, error => {

          this.notificationService.failure(error.error);
        });
      }


    }
  }

  onSubmitnAddNew() {
    if (this.service.form.valid) {
      this.service.insertNodeTypeAttributeName(this.service.form.value).subscribe(response => {

        this.saveAndAddNewTapped = true;
        console.log("Response - add new node type attribute name : ", response);
        this.notificationService.success("Saved successfully");
        this.service.form.reset();

      }, error => {

        this.notificationService.failure(error.error);
      });
    }
  }

  onClose(data) {
    this.service.form.reset();
    this.service.initializeFormGroup();
    this.dialogRef.close(data);
  }



}
