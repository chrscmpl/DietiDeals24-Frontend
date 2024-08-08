import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([AuthenticationInterceptor.asHttpInterceptorFn()]),
        ),
        importProvidersFrom([BrowserAnimationsModule]),
        MessageService,
        ConfirmationService,
        OneCharUpperPipe,
        { provide: LOCALE_ID, useValue: 'en-US' },
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
