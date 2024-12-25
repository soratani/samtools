import { every, isEqual, isEqualWith } from "lodash";
import { isArray, isNull, isObject, isUndefined, type } from "./type";

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