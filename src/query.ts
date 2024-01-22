import { isObject, isEmpty, isString, isNum } from ".";

export function make(obj: any): string {
    if (!isObject(obj) || isEmpty(obj)) return "";
    return Object.entries(obj).reduce((a, b, idx) => {
        const [key, value] = b;
        if(isEmpty(value)) return a;
        if (!idx) return `${a}?${key}=${encodeURIComponent(value as any)}`;
        return `${a}&${key}=${value}`;
    }, "")
}
export function parseQuery(str: string = '') {
    if (!isString(str) || isEmpty(str)) return {};
    const [, query] = str.split("?");
    if(isEmpty(query)) return {};
    return query.split("&").filter(Boolean).reduce((a: any, b) => {
        const [key, value] = b.split("=").filter(Boolean);
        if(isEmpty(value)) return a;
        if(isNum(Number(decodeURIComponent(value)))) {
            a[key] = Number(decodeURIComponent(value));
        } else if (['true', 'false'].includes(decodeURIComponent(value))) {
            a[key] = decodeURIComponent(value) === 'true';
        } else {
            a[key] = decodeURIComponent(value);
        }
        return a;
    }, {});
}

export function parseUrl(url: string) {
    if (!isString(url) || isEmpty(url)) return '';
    const [_url] = url.split("?");
    return _url;
}

export function mergeQueryToURL(url: string, obj?: any) {
    const _url = parseUrl(url);
    const _query = parseQuery(url);
    const query = make({ ..._query, ...obj });
    return `${_url}${query}`;
}
