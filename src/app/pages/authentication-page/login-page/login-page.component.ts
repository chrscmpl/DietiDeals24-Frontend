import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { InputComponent } from '../../../components/input/input.component';
import { DividerModule } from 'primeng/divider';
import { UserCredentials } from '../../../DTOs/user.dto';
import { environment } from '../../../../environments/environment';
import { reactiveFormsUtils } from '../../../helpers/reactive-forms-utils';
import { MessageService } from 'primeng/api';
import { NavigationService } from '../../../services/navigation.service';
import { LoginException } from '../../../exceptions/login.exception';
import { GetUserDataException } from '../../../exceptions/get-user-data.exception';

interface loginForm {
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
    selector: 'dd24-login-page',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        RouterLink,
        InputComponent,
        InputTextModule,
        ButtonModule,
        PasswordModule,
        DividerModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnInit, AfterViewInit {
    public loginForm!: FormGroup<loginForm>;

    public submissionLoading: boolean = false;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly navigation: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly element: ElementRef,
        private readonly message: MessageService,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group<loginForm>({
            email: new FormControl(null, {
                validators: [Validators.required, Validators.email],
                updateOn: 'blur',
            }),
            password: new FormControl(null, {
                validators: [
                    Validators.required,
                    Validators.minLength(8),
                    Validators.pattern(environment.passwordPattern),
                ],
                updateOn: 'blur',
            }),
        });
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.patchValueFromNativeElement('email', '#email');
            this.patchValueFromNativeElement('password', '#password');
        }, 500);
    }

    private patchValueFromNativeElement(
        controlName: string,
        querySelector: string,
    ): void {
        const nativeInput = this.element.nativeElement.querySelector(
            querySelector,
        ) as HTMLInputElement | null;

        if (nativeInput?.value)
            this.loginForm.get(controlName)?.patchValue(nativeInput.value);
    }

    dd24Login() {
        if (this.loginForm.invalid) {
            reactiveFormsUtils.markAllAsDirty(this.loginForm);
            return;
        }
        this.submissionLoading = true;
        this.authenticationService.login(
            this.loginForm.value as UserCredentials,
            {
                next: () => {
                    this.navigation.navigateToRouteBeforeRedirection();
                },
                error: (e: LoginException | GetUserDataException) => {
                    this.submissionLoading = false;
                    if (e.error.status >= 500) {
                        this.displayError(
                            'Server error',
                            'Please try again later',
                        );
                    } else if (e.error.status >= 400) {
                        this.displayError(
                            'Incorrect email or password',
                            'Please try again',
                        );
                    } else {
                        this.displayError(
                            'An error occurred',
                            'Please try again',
                        );
                    }
                },
            },
        );
    }

    googleLogin() {}

    private displayError(summary: string, detail: string): void {
        this.message.add({
            severity: 'error',
            summary,
            detail,
        });
    }
}
