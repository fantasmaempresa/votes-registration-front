import {Component, HostBinding, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormValidationService} from "../../../../shared/services/form-validation.service";
import {validationMessages} from "../../../../core/constants/validationMessages";
import {AuthService} from "../../../../core/services/auth.service";
import {SocketService} from "../../../../core/services/socket.service";
import {bindCallback, switchMap, tap} from "rxjs";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    @HostBinding('class') classes = 'flex-fill justify-content-center row';

    constructor(private formValidationService: FormValidationService,
                private router: Router,
                private socketService: SocketService,
                private authService: AuthService) {
    }

    signUpForm!: FormGroup;

    hidePassword = true;

    isLoading = false;

    formErrors: any = {};

    incorrectLogin = false;

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
        this.authService.tryOfLogin(this.signUpForm.value)
            .pipe(
                switchMap((data: any) => {
                    console.log(data);
                    if (data.access) {
                        console.log('Access true');
                        return this.authService.login(this.signUpForm.value)
                            .pipe(
                                switchMap((tokens: any) => {
                                    this.authService.storeTokens(tokens);
                                    this.router.navigate(['app'])
                                    return this.authService.getDataUserLogged()
                                        .pipe(
                                            tap((user: any) => this.authService.storeUser(user))
                                        )
                                })
                            )
                    } else {
                        const getDataAsObservable = bindCallback(this.socketService.subscribeToChannel)
                        return getDataAsObservable('authorize', 'AuthorizeLoginEvent');
                    }
                })
            ).subscribe(res => {
                console.log(res);
        })
        // this.authService.login(this.signUpForm.value)
        //     .pipe(
        //         switchMap((tokens: any) => {
        //             this.authService.storeTokens(tokens);
        //             this.router.navigate(['app'])
        //             return this.authService.getDataUserLogged()
        //         })
        //     )
        //     .subscribe({
        //             next: (user: any) => {
        //                 this.authService.storeUser(user);
        //             },
        //             error: () => {
        //                 this.isLoading = false;
        //                 this.incorrectLogin = true;
        //             },
        //         }
        //     )
    }
}
