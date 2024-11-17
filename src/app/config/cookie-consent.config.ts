import { NgcCookieConsentConfig } from 'ngx-cookieconsent';

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
};
