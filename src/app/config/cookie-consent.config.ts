import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { localStorageWithConsent } from '../helpers/local-storage-with-consent.helper';

export const cookieConfig: NgcCookieConsentConfig = {
    cookie: {
        domain: 'www.dietideals24.click',
    },
    palette: {
        popup: {
            background: '#000',
        },
        button: {
            background: '#f1d600',
        },
    },
    theme: 'edgeless',
    type: 'opt-out',
    enabled: !localStorageWithConsent.consent,
};
