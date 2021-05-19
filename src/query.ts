import { isObject, isEmpty, isString } from ".";
import { isArray } from "./type";

export function makeObjectToQuery(obj: any): string {
    if (!isObject(obj) || isEmpty(obj)) return "";
    return Object.entries(obj).reduce((a, b, idx) => {
        const [key, value] = b;
        if (!idx) return `${a}?${key}=${value}`;
        return `${a}&${key}=${value}`;
    }, "")
}
export function makeQueryToObject(str: string) {
    if (!isString(str) || isEmpty(str)) return {};
    const [, query] = str.split("?");
    if (!isString(str) || isEmpty(str)) return {};
    return query.split("&").reduce((a: any, b) => {
        if (!isString(b) || isEmpty(b)) return a;
        const [key, value] = b.split("=");
        a[key] = value;
        return a;
    }, {});
}

export function makeParamsToUrl(url: string, obj: any) {
    const query = makeObjectToQuery(obj);
    return `${url}${query}`;
}

export function makeParamsToUrlPath(url: string, params: string[] | number[]) {
    if (!isArray(params) || isEmpty(params) || !isString(url) || isEmpty(url)) return url;
    return [url].concat(params as any).join("/");
}