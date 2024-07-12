import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { IntervalPipe } from './pipes/interval.pipe';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';
import { importProvidersFrom, isDevMode } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuctionsRequestGuard } from './guards/auctions-request.guard';
import { HideUIGuard } from './guards/hide-ui.guard';
import { ShowUIGuard } from './guards/show-ui.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { provideServiceWorker } from '@angular/service-worker';
import { EmailVerificationGuard } from './guards/email-not-verified.guard';
import { MaskedEmailPipe } from './pipes/masked-email.pipe';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authorizationInterceptor])),
        importProvidersFrom([BrowserAnimationsModule]),
        Location,
        LocalDatePipe,
        OneCharUpperPipe,
        DatePipe,
        TitleCasePipe,
        IntervalPipe,
        CurrencyPipe,
        MaskedEmailPipe,
        AuctionsRequestGuard,
        HideUIGuard,
        ShowUIGuard,
        AuthenticationGuard,
        EmailVerificationGuard,
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
