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
import { cookieConfig } from './config/cookie-consent.config';
import { provideNgcCookieConsent } from 'ngx-cookieconsent';

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
        provideNgcCookieConsent(cookieConfig),
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
