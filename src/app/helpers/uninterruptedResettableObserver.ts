import { Observer } from 'rxjs';

export type UninterruptedResettableObserver<T> = Observer<T> & {
    reset?: () => void;
};
