import { Injectable } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable()
export class CustomPrimeNGConfig extends PrimeNGConfig {
    override ripple = true;
}
