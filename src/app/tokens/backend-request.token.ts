import { HttpContextToken } from '@angular/common/http';

export const BACKEND_REQUEST = new HttpContextToken(() => true);
