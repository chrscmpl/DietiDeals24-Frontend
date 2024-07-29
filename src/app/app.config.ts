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
import { HideUIGuard } from './guards/hide-ui.guard';
import { ShowUIGuard } from './guards/show-ui.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { provideServiceWorker } from '@angular/service-worker';
import { EmailVerificationGuard } from './guards/email-not-verified.guard';
import { MaskedPipe } from './pipes/masked.pipe';
import { FindCurrencyPipe } from './pipes/find-currency.pipe';
import { ResolveAuctionGuard } from './guards/resolve-auction.guard';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmReloadGuard } from './guards/confirm-reload.guard';

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
        MaskedPipe,
        FindCurrencyPipe,
        HideUIGuard,
        ShowUIGuard,
        AuthenticationGuard,
        EmailVerificationGuard,
        ResolveAuctionGuard,
        ConfirmReloadGuard,
        MessageService,
        ConfirmationService,
        provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000',
        }),
    ],
};
