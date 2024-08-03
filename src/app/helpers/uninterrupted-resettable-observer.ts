/* eslint-disable @typescript-eslint/no-explicit-any */

export type UninterruptedResettableObserver<T> = {
    next?: ((value: T) => void) | (() => void);
    error?: ((value: any) => void) | (() => void);
    complete?: () => void;
    reset?: () => void;
};
