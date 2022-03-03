import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user-form.component.html',
  styleUrls: ['./new-user-form.component.scss']
})
export class NewUserFormComponent implements OnInit {

  form!: FormGroup;

  constructor() { }

  ngOnInit(): void {
  }

  createUser() {

  }

}
