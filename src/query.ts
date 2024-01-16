import { isObject, isEmpty, isString } from ".";

export function make(obj: any): string {
    if (!isObject(obj) || isEmpty(obj)) return "";
    return Object.entries(obj).reduce((a, b, idx) => {
        const [key, value] = b;
        if(isEmpty(value)) return a;
        if (!idx) return `${a}?${key}=${encodeURIComponent(value as any)}`;
        return `${a}&${key}=${value}`;
    }, "")
}
export function parse(str: string = '') {
    if (!isString(str) || isEmpty(str)) return {};
    const [, query] = str.split("?");
    if(isEmpty(query)) return {};
    return query.split("&").filter(Boolean).reduce((a: any, b) => {
        const [key, value] = b.split("=");
        if(isEmpty(value)) return a;
        a[key] = decodeURIComponent(value);
        return a;
    }, {});
}

export function makeQueryToURL(url: string, obj: any) {
    const query = parse(obj);
    return `${url}?${query}`;
}
