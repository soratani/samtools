import { isNull, isObject, isUndefined } from "./type";

type PickKeys<T = any> = T[];

type GetIndexedField<T, K> = K extends keyof T
? T[K]
: K extends `${number}`
    ? 'length' extends keyof T
        ? number extends T['length']
            ? number extends keyof T
                ? T[number]
                : undefined
            : undefined
        : undefined
    : undefined;

type FieldWithPossiblyUndefined<T, Key> =
| GetFieldType<Exclude<T, undefined>, Key>
| Extract<T, undefined>;

type IndexedFieldWithPossiblyUndefined<T, Key> =
| GetIndexedField<Exclude<T, undefined>, Key>
| Extract<T, undefined>;

type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
? Left extends keyof Exclude<T, undefined>
    ? FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right> | Extract<T, undefined>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
        ? FieldKey extends keyof T
            ? FieldWithPossiblyUndefined<IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>, Right>
            : undefined
        : undefined
: P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
        ? FieldKey extends keyof T
            ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
            : undefined
        : IndexedFieldWithPossiblyUndefined<T, P>;

/**
 * 获取数据信息
 * @param data 
 * @param id 
 * @param defaultData 
 * @returns 
 */
export function get<TObject, TPath extends string, TDefault = GetFieldType<TObject, TPath>>(data: TObject, id: TPath, defaultData?: TDefault): Exclude<GetFieldType<TObject, TPath>, null | undefined> | TDefault {
    if (!id || !data) return defaultData;
    let keys = id.replace(/[{}\[\]()]/g, '.').split('.').filter(Boolean);
    let node = data;
    while(keys.length && !isNull(node) && !isUndefined(node)) {
        const key = keys.shift();
        node = node[key];
    }
    return (node || defaultData) as Exclude<GetFieldType<TObject, TPath>, null | undefined> | TDefault;
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