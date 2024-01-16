import { isNull, isObject, isUndefined } from "./type";

type PickKeys<T = any> = T[]; 

/**
 * 获取数据信息
 * @param data 
 * @param id 
 * @param defaultData 
 * @returns 
 */
export function get<D = any>(data: any, id: string, defaultData?: D): D {
    if (!id || !data) return defaultData;
    let keys = id.replace(/[{}\[\]()]/g, '.').split('.').filter(Boolean);
    let node = data;
    while(keys.length && !isNull(node) && !isUndefined(node)) {
        const key = keys.shift();
        node = node[key];
    }
    return node || defaultData;
}

export function pick<D extends object, T extends keyof D>(data: D, keys: PickKeys<T> = []): Pick<D, T> {
    if (!data || !keys || !keys.length || !isObject(data)) return data;
    return Object.entries(data).reduce<Pick<D, T>>((a, b) => {
        const [key, value] = b;
        if (keys.includes(key as T)) {
            a[key] = value;
        }
        return a;
    }, {} as Pick<D, T>)
}

export function omit<D extends object, T extends keyof D>(data: D, keys: PickKeys<T> = []): Omit<D, T>  {
    if (!data || !keys || !keys.length || !isObject(data)) return data;
    return Object.entries(data).reduce<Omit<D, T>>((a, b) => {
        const [key, value] = b;
        if (!keys.includes(key as T)) {
            a[key] = value;
        }
        return a;
    }, {} as Omit<D, T>) 
}