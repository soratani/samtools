import { cloneDeep, every, filter, isEqual, isEqualWith, reduce } from "lodash";
import { isArray, isNull, isObject, isString, isUndefined, type } from "./type";

export function isDeepEqual(a: any, b: any) {
    function isEqualKeys(keys: string[], _keys: string[]) {
        const sk = keys.sort();
        const _sk = _keys.sort();
        return isEqual(sk, _sk);
    }

    return isEqualWith(a, b, (n, o) => {
      if (type(n) !== type(o)) return false;
      if (isObject(n)) {
        const nk = Object.keys(n);
        const ok = Object.keys(o);
        if (nk.length !== ok.length || !isEqualKeys(nk, ok)) return false;
        return every(nk, (key) => isDeepEqual(n[key], o[key]));
      }
      if (isArray(n)) {
        if (n.length !== o.length) return false;
        return every(n, (item, index) => {
            return isDeepEqual(item, o[index]);
        })
      }
      if (isUndefined(n)) return isUndefined(o);
      if (isNull(n)) return isNull(o);
      return isEqual(n, o);
    })
  }

export function deepDelete(data: any, path: string) {
    const clone = cloneDeep(data);
    if (!path || !isString(path)) return clone;
    const paths = filter(path.split('.'), Boolean);
    if (!paths.length) return clone;
    const key = paths.shift() as string;
    if (isObject(clone)) {
        if (paths.length) {
            clone[key] = deepDelete(clone[key], paths.join('.'));
        } else {
            delete clone[key];
        }
        return clone;
    }
    if (isArray(clone)) {
        if (paths.length) {
            clone[key] = deepDelete(clone[key], paths.join('.'));
        } else {
            clone.splice(Number(key), 1);
        }
        return clone;
    }
    return clone;
}

export function insertArray(arr: any[], index: number, item: any) {
    if (!Array.isArray(arr)) return arr;
    const clone = cloneDeep(arr);
    clone.splice(index, 0, item);
    return clone;
}