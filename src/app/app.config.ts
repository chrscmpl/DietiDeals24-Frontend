import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LocalDatePipe } from './pipes/local-date.pipe';
import { OneCharUpperPipe } from './pipes/one-char-upper.pipe';
import { DatePipe } from '@angular/common';
import { IntervalPipe } from './pipes/interval.pipe';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    LocalDatePipe,
    OneCharUpperPipe,
    DatePipe,
    IntervalPipe,
  ],
};
