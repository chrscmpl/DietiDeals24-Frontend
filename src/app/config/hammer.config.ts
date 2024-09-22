import { Injectable } from '@angular/core';
import { HammerGestureConfig } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

@Injectable()
export class CustomHammerConfig extends HammerGestureConfig {
    override overrides = {
        swipe: { direction: Hammer.DIRECTION_HORIZONTAL },
    };
}
