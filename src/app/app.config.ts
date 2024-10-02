import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import {
    ConfirmationService,
    MessageService,
    PrimeNGConfig,
} from 'primeng/api';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { PrependBackendHostInterceptor } from './interceptors/prepend-backend-host.interceptor';
import 'hammerjs';
import { HammerGestureConfig, HammerModule } from '@angular/platform-browser';
import { CustomHammerConfig } from './config/hammer.config';
import { CustomPrimeNGConfig } from './config/primeng.config';
import {
    GoogleLoginProvider,
    SocialAuthServiceConfig,
} from '@abacritt/angularx-social-login';
import { AuthenticationService } from './services/authentication.service';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                PrependBackendHostInterceptor.asHttpInterceptorFn(),
                AuthenticationInterceptor.asHttpInterceptorFn(),
            ]),
        ),
        importProvidersFrom([BrowserAnimationsModule, HammerModule]),
        {
            provide: HammerGestureConfig,
            useClass: CustomHammerConfig,
        },
        {
            provide: PrimeNGConfig,
            useClass: CustomPrimeNGConfig,
        },
        MessageService,
        ConfirmationService,
        OneCharUpperPipe,
        { provide: LOCALE_ID, useValue: 'en-US' },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                lang: 'en',
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '204255150104-09laqhd05kocqpg8ngc1ujoaqi75af4v.apps.googleusercontent.com',
                            {
                                prompt: AuthenticationService.authorizationToken
                                    ? 'none'
                                    : 'select_account',
                                // scopes: ['profile', 'email'],
                            },
                        ),
                    },
                ],
                onError: (err) => {
                    console.error(err);
                },
            } as SocialAuthServiceConfig,
        },
    ],
};
