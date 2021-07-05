import { isEmpty, isNum } from "./type";

export function enumToList<K = number, V = string>(params: any): [K, V][] {
    if (isEmpty(params)) return [];
    const list: [K, V][] = [];
    for (const key in params) {
        if (isNum(params[key])) list.push([params[key], key as any]);
    }
    return list;
}