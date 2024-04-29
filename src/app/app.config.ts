import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { IntervalPipe } from './pipes/interval.pipe';
import { MoneyPipe } from './pipes/money.pipe';
import {
    HTTP_INTERCEPTORS,
    HttpClient,
    provideHttpClient,
} from '@angular/common/http';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        { provide: HTTP_INTERCEPTORS, useClass: AuthorizationInterceptor },
        HttpClient,
        Location,
        LocalDatePipe,
        OneCharUpperPipe,
        DatePipe,
        IntervalPipe,
        MoneyPipe,
        CurrencyPipe,
    ],
};
