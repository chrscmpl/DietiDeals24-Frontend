export class localStorageWithConsent {
    public static consent = document.cookie.includes(
        'cookieconsent_status=allow',
    );

    public static getItem(key: string): string | null {
        return localStorage.getItem(key);
    }
    public static setItem(key: string, value: string): void {
        if (localStorageWithConsent.consent) localStorage.setItem(key, value);
    }
}
