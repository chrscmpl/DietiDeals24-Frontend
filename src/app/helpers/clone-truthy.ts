export function cloneTruthy(source: object): object {
    const res: { [key: string]: string[] } = {};
    for (const entry of Object.entries(source).filter((entry) => !!entry[1])) {
        res[entry[0]] = entry[1];
    }
    return res;
}
