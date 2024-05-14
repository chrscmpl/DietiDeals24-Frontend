import { ApplicationConfig } from '@angular/core';
import { provideRouter, withDebugTracing } from '@angular/router';

import { routes } from './app.routes';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { IntervalPipe } from './pipes/interval.pipe';
import { MoneyPipe } from './pipes/money.pipe';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authorizationInterceptor } from './interceptors/authorization.interceptor';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes, withDebugTracing()),
        provideHttpClient(withInterceptors([authorizationInterceptor])),
        importProvidersFrom([BrowserAnimationsModule]),
        Location,
        LocalDatePipe,
        OneCharUpperPipe,
        DatePipe,
        IntervalPipe,
        MoneyPipe,
        CurrencyPipe,
    ],
};
