class QueryUtils {
    queryStringToObject(query: string): { [key: string]: string } {
        return query.split('&').reduce(
            (obj: { [key: string]: string }, queryString: string) => {
                const [key, value] = queryString.split('=');
                return { ...obj, [key]: value };
            },
            {} as { [key: string]: string },
        );
    }
}

export const queryUtils = new QueryUtils();
