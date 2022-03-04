import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserService} from "../../../../data/services/user.service";

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss']
})
export class NewUserFormComponent implements OnInit {

  form!: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewUserFormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private userService: UserService) { }

  ngOnInit(): void {
    this.createFormGroup();
    console.log(this.data);
  }

  createFormGroup() {
    this.form = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'email': new FormControl('', [Validators.required]),
      'password': new FormControl('', [Validators.required]),
      'type': new FormControl(2, [Validators.required]),
    })
  }

  createUser() {
    this.userService.save(this.form.value).subscribe(res => console.log(res))
  }

}
