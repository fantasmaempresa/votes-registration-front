import {Component, HostBinding, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {FormValidationService} from "../../../../shared/services/form-validation.service";
import {validationMessages} from "../../../../core/constants/validationMessages";
import {AuthService} from "../../../../core/services/auth.service";
import {SocketService} from "../../../../core/services/socket.service";
import {bindCallback, switchMap, tap, throwError} from "rxjs";
import Swal from "sweetalert2";
import {MINUTE} from "../../../../core/constants/constants";
import {WINDOW} from "../../../../core/providers/window.provider";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @HostBinding('class') classes = 'flex-fill justify-content-center row';
  timeoutId!: any;
  signUpForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  formErrors: any = {};
  incorrectLogin = false;

  constructor(
    @Inject(WINDOW) private window: Window,
    private formValidationService: FormValidationService,
              private router: Router,
              private socketService: SocketService,
              private authService: AuthService) {
    console.log(window.location.hostname);
  }

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
    Swal.fire(
      {
        text: 'Solicitando acceso al administrador...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen(popup: HTMLElement) {
          Swal.showLoading();
        }
      }
    ).then();
    this.timeoutId = setTimeout(async () => {
      await Swal.fire({
        icon: 'error',
        title: 'Oops... ☹',
        text: 'En este momento no hay administradores para autorizar tu inicio de sesión',
      });
      clearTimeout(this.timeoutId);
      tryoFLogin$.unsubscribe();
    }, (MINUTE * 5));
    let requestLogin$ = this.authService.login(this.signUpForm.value)
      .pipe(
        switchMap((tokens: any) => {
          Swal.close();
          this.authService.storeTokens(tokens);
          return this.authService.getDataUserLogged()
            .pipe(
                tap((user: any) => this.authService.storeUser(user)),
                tap(() => this.router.navigate(['app']))
            )
        })
      );
    let tryoFLogin$ = this.authService.tryOfLogin(this.signUpForm.value)
      .pipe(
        switchMap((data: any) => {
          if (data.access) {
            return requestLogin$;
          } else {
            const getDataAsObservable = bindCallback(this.socketService.subscribeToChannel)
            return getDataAsObservable('authorize', 'AuthorizeLoginEvent')
              .pipe(
                switchMap((res: any) => {
                  console.log(res);
                  if (res.user.email === this.signUpForm.value.username && res.user.access) {
                    return requestLogin$;
                  } else {
                    return throwError(() => new Error(`Inicio de sesión rechazado por el administrador`));
                  }
                })
              );
          }
        })
      )
      .subscribe({
          next: (res: any) => {
            clearTimeout(this.timeoutId);
          },
          error: async (err: any) => {
            this.isLoading = false;
            clearTimeout(this.timeoutId);
            await Swal.fire({
              icon: 'error',
              title: 'Oops... ☹',
              text: 'Se ha rechazado tu intento de inicio de sesión',
            })
          }
        }
      )
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
