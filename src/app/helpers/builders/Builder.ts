/* eslint-disable @typescript-eslint/no-explicit-any */
export class Builder<T> {
    private getConstructor: (type: string) => (item: any) => T;
    private typeKey: string;

    public constructor(
        getConstructor: (type: string) => (item: any) => T,
        typeKey: string,
    ) {
        this.getConstructor = getConstructor;
        this.typeKey = typeKey;
    }

    private build(item: any): T {
        return this.getConstructor(item[this.typeKey])(item);
    }

    public buildSingle(item: any): T {
        return this.build(item);
    }

    public buildArray(items: any[]): T[] {
        return items.map((item) => this.build(item));
    }
}
