import { Component, OnInit, Injectable, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  form: FormGroup;
  profilePicData: any
  img: any;
  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ApiService: ApiService,
    private _snackBar: MatSnackBar,
    private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.createForm();
    if (this.data.isEdit) {
      this.filldata();
    }
  }


  filldata() {
    this.form.patchValue({
      firstName: this.data.user.firstName,
      lastName: this.data.user.lastName,
      email: this.data.user.email,
      mobileNo: this.data.user.mobileNo,
    })
    if (this.data.user.avatar && this.data.user.avatar.data) {
      let TYPED_ARRAY = new Uint8Array(this.data.user.avatar.data);
      const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
        return data + String.fromCharCode(byte);
      }, '');
      let base64String = btoa(STRING_CHAR);
      this.img = this.domSanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + base64String);
    }
  }
  createForm() {
    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.maxLength(100)]],
      lastName: [null, [Validators.required, Validators.maxLength(100)]],
      email: [null, [Validators.required, Validators.email]],
      mobileNo: [null, [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    })
  }

  submit() {
    const controls = this.form.controls;
    if (this.form.invalid) {
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      )
      return;
    }
    if (this.data.isEdit) {
      this.ApiService.updateUser(this.data.user._id, this.form.value).subscribe(
        res => {
          if (this.profilePicData) {
            this.uploadImage(res._id);
          }
          else {
            this.dialogRef.close(true);
          }
        },
        err => {
          this._snackBar.open(err.message, '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      )
    }
    else {
      this.ApiService.postuser(this.form.value).subscribe(
        res => {
          if (this.profilePicData) {
            this.uploadImage(res._id);
          }
          else {
            this.dialogRef.close(true);
          }
        }, err => {
          this._snackBar.open(err.message, '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        }
      )
    }
  }

  uploadImage(id) {
    const formData = new FormData();
    formData.append('avatar', this.profilePicData);
    this.ApiService.updateAvatar(id, formData).subscribe(
      res => {
        this.dialogRef.close(true);
      }
    )

  }

  close() {
    this.dialogRef.close();
  }


  onFileSelect(event) {
    if (event.target.files.length > 0) {
      if (event.target.files[0].type.indexOf('image/') >= 0) {
        if (event.target.files[0].size > 1048576) {
          return this._snackBar.open('Select picture of size less than 1MB')
        }
        var reader = new FileReader();
        this.profilePicData = event.target.files[0];
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (e: any) => {
          this.img = e.target.result;
        }
      }
    }
  }



  isControlHasError(controlName: string, validationType: string): boolean {
    const control = this.form.controls[controlName];
    if (!control)
      return false
    const result = control.hasError(validationType) && (control.dirty || control.touched)
    return result
  }
}
