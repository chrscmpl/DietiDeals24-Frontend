import { SocialUser } from '@abacritt/angularx-social-login';

export interface SocialRegistrationData {
    username: string;
    name: string;
    surname: string;
    birthday: Date;
    country: string;
    city: string;
    socialUser: SocialUser;
}
