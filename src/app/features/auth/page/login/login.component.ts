import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormValidationService} from "../../../../shared/services/form-validation.service";
import {validationMessages} from "../../../../core/constants/validationMessages";
import {AuthService} from "../../../../core/services/auth.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @HostBinding('class') classes = 'flex-fill justify-content-center row';

    constructor(private formValidationService: FormValidationService, private router: Router,
                private authService: AuthService) {
    }

    signUpForm!: FormGroup;

    hidePassword = true;

    isLoading = false;

    formErrors: any = {};

    ngOnInit(): void {
        this.signUpForm = new FormGroup(
            {
                username: new FormControl('', [Validators.required, Validators.email]),
                password: new FormControl('', Validators.required),
                confirmPassword: new FormControl('', Validators.required),
            },
            {
                validators: this.formValidationService.matchConfirmItems('password', 'confirmPassword'),
            },
        );

        this.signUpForm.valueChanges.subscribe(() => {
            this.logValidationErrors();
        });
    }

    logValidationErrors() {
        this.formErrors = this.formValidationService.getValidationErrors(
            this.signUpForm,
            validationMessages,
        );
    }

    onSubmit() {
        this.signUpForm.markAllAsTouched();
        this.logValidationErrors();
        this.isLoading = true;
        this.authService.login(this.signUpForm.value).subscribe((res: any) => {
            if(res.access_token) {
                localStorage.setItem('token', res.access_token);
                this.router.navigate(['search'])
            }

        })
    }
}
