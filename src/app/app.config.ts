import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { IntervalPipe } from './pipes/interval.pipe';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuctionsRequestGuard } from './guards/auctions-request.guard';
import { HideUIGuard } from './guards/hide-ui.guard';
import { ShowUIGuard } from './guards/show-ui.guard';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([authorizationInterceptor])),
        importProvidersFrom([BrowserAnimationsModule]),
        Location,
        LocalDatePipe,
        OneCharUpperPipe,
        DatePipe,
        IntervalPipe,
        CurrencyPipe,
        AuctionsRequestGuard,
        HideUIGuard,
        ShowUIGuard,
    ],
};
