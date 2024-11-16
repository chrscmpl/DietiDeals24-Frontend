export class localStorageWithConsent {
    private static _consent = localStorage.getItem('consent') === 'true';

    public static get consent(): boolean {
        return localStorageWithConsent._consent;
    }

    public static getItem(key: string): string | null {
        return localStorage.getItem(key);
    }
    public static setItem(key: string, value: string): void {
        if (localStorageWithConsent._consent) localStorage.setItem(key, value);
    }
    public static addConsent(): void {
        localStorageWithConsent._consent = true;
        localStorage.setItem('consent', 'true');
    }
}
