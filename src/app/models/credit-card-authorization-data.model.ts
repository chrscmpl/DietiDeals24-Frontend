export class CreditCardAuthorizationData {
    private _token: string;

    public constructor(token: string) {
        this._token = token;
    }

    public get token(): string {
        return this._token;
    }
}
