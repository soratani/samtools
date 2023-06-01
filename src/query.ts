import { isObject, isEmpty, isString } from ".";

export function make(obj: string): string {
    if (!isObject(obj) || isEmpty(obj)) return "";
    return Object.entries(obj).reduce((a, b, idx) => {
        const [key, value] = b;
        if (!idx) return `${a}?${key}=${value}`;
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
