/* eslint-disable @typescript-eslint/no-explicit-any */
class Utils {
    public cloneTruthy(source: { [key: string]: any }): { [key: string]: any } {
        const res: { [key: string]: string[] } = {};
        for (const entry of Object.entries(source).filter(
            (entry) => !!entry[1],
        )) {
            res[entry[0]] = entry[1];
        }
        return res;
    }

    public compareOwnProperties(
        source: { [key: string]: any },
        target: { [key: string]: any },
    ): boolean {
        const sourceProps = Object.getOwnPropertyNames(source);
        const targetProps = Object.getOwnPropertyNames(target);

        if (sourceProps.length !== targetProps.length) {
            return false;
        }

        for (const prop of sourceProps) {
            if (source[prop] !== target[prop]) {
                return false;
            }
        }

        return true;
    }

    public splitArray<T>(
        array: T[],
        condition: (elem: T) => boolean,
    ): { success: T[]; failure: T[] } {
        const failure: T[] = [];

        const success = array.filter((elem) => {
            if (condition(elem)) return true;
            failure.push(elem);
            return false;
        });

        return { success, failure };
    }
}

export const utils = new Utils();
