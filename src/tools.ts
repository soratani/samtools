import { isArray, isObject, isString } from "./type";


export function cloneDeep<T>(value: T): T {
    // Iterative implementation (no recursion)
    if (value === null || typeof value !== 'object') return value;

    const seen = new WeakMap<any, any>();

    const createEmpty = (val: any) => {
        if (val instanceof Date) return new Date(val.getTime());
        if (val instanceof RegExp) return new RegExp(val.source, (val as RegExp).flags);
        if (Array.isArray(val)) return [];
        if (val instanceof Map) return new Map();
        if (val instanceof Set) return new Set();
        if (ArrayBuffer.isView(val)) {
            const Ctor = (val as any).constructor as any;
            return new Ctor((val as any).length);
        }
        const proto = Object.getPrototypeOf(val);
        return Object.create(proto);
    };

    const root = createEmpty(value as any);
    seen.set(value as any, root);

    const stack: Array<{ src: any; dst: any }> = [{ src: value as any, dst: root }];

    while (stack.length) {
        const { src, dst } = stack.pop()!;

        // Handle Map
        if (src instanceof Map) {
            src.forEach((v: any, k: any) => {
                if (v && typeof v === 'object') {
                    if (seen.has(v)) dst.set(k, seen.get(v));
                    else {
                        const node = createEmpty(v);
                        seen.set(v, node);
                        dst.set(k, node);
                        stack.push({ src: v, dst: node });
                    }
                } else dst.set(k, v);
            });
            continue;
        }

        // Handle Set
        if (src instanceof Set) {
            src.forEach((v: any) => {
                if (v && typeof v === 'object') {
                    if (seen.has(v)) dst.add(seen.get(v));
                    else {
                        const node = createEmpty(v);
                        seen.set(v, node);
                        dst.add(node);
                        stack.push({ src: v, dst: node });
                    }
                } else dst.add(v);
            });
            continue;
        }

        // TypedArray / ArrayBuffer view
        if (ArrayBuffer.isView(src)) {
            // copy elements
            for (let i = 0; i < (src as any).length; i++) dst[i] = (src as any)[i];
            continue;
        }

        // Array
        if (Array.isArray(src)) {
            for (let i = 0; i < src.length; i++) {
                const v = src[i];
                if (v && typeof v === 'object') {
                    if (seen.has(v)) dst[i] = seen.get(v);
                    else {
                        const node = createEmpty(v);
                        seen.set(v, node);
                        dst[i] = node;
                        stack.push({ src: v, dst: node });
                    }
                } else dst[i] = v;
            }
            // copy non-index own props and symbols
            const keys = Object.keys(src).filter((k) => String(Number(k)) !== k);
            for (const key of keys) {
                const v = (src as any)[key];
                if (v && typeof v === 'object') {
                    if (seen.has(v)) dst[key] = seen.get(v);
                    else {
                        const node = createEmpty(v);
                        seen.set(v, node);
                        dst[key] = node;
                        stack.push({ src: v, dst: node });
                    }
                } else dst[key] = v;
            }
            const syms = Object.getOwnPropertySymbols(src);
            for (const s of syms) dst[s as any] = (src as any)[s as any];
            continue;
        }

        // Plain object
        const ownKeys = Object.keys(src);
        for (const key of ownKeys) {
            const v = src[key];
            if (v && typeof v === 'object') {
                if (seen.has(v)) dst[key] = seen.get(v);
                else {
                    const node = createEmpty(v);
                    seen.set(v, node);
                    dst[key] = node;
                    stack.push({ src: v, dst: node });
                }
            } else dst[key] = v;
        }
        const symbols = Object.getOwnPropertySymbols(src);
        for (const sym of symbols) {
            const v = src[sym as any];
            if (v && typeof v === 'object') {
                if (seen.has(v)) dst[sym as any] = seen.get(v);
                else {
                    const node = createEmpty(v);
                    seen.set(v, node);
                    dst[sym as any] = node;
                    stack.push({ src: v, dst: node });
                }
            } else dst[sym as any] = v;
        }
    }

    return root as T;
}

export function isEqual(a: any, b: any): boolean {
    const aStack: any[] = [];
    const bStack: any[] = [];

    function eq(x: any, y: any): boolean {
        if (x === y) return x !== 0 || 1 / x === 1 / y; // -0
        if (x !== x && y !== y) return true; // NaN
        const typeX = typeof x;
        const typeY = typeof y;
        if (typeX !== 'object' || typeY !== 'object') return false;
        if (x == null || y == null) return x === y;

        // cyclic references
        for (let i = 0; i < aStack.length; i++) {
            if (aStack[i] === x) return bStack[i] === y;
        }

        const toString = Object.prototype.toString;
        const xTag = toString.call(x);
        const yTag = toString.call(y);
        if (xTag !== yTag) return false;

        switch (xTag) {
            case '[object String]':
            case '[object Boolean]':
            case '[object Number]':
                return Object.prototype.valueOf.call(x) === Object.prototype.valueOf.call(y);
            case '[object Date]':
                return (x as Date).getTime() === (y as Date).getTime();
            case '[object RegExp]':
                return (x as RegExp).source === (y as RegExp).source && (x as RegExp).flags === (y as RegExp).flags;
            case '[object Map]':
                if ((x as Map<any, any>).size !== (y as Map<any, any>).size) return false;
                break;
            case '[object Set]':
                if ((x as Set<any>).size !== (y as Set<any>).size) return false;
                break;
            default:
                break;
        }

        aStack.push(x);
        bStack.push(y);

        if (xTag === '[object Array]') {
            if ((x as any[]).length !== (y as any[]).length) {
                aStack.pop();
                bStack.pop();
                return false;
            }
            for (let i = 0; i < (x as any[]).length; i++) if (!eq(x[i], y[i])) {
                aStack.pop();
                bStack.pop();
                return false;
            }
            aStack.pop();
            bStack.pop();
            return true;
        }

        if (xTag === '[object Map]') {
            const mx = x as Map<any, any>;
            const my = y as Map<any, any>;
            for (const [kx, vx] of mx) {
                let found = false;
                for (const [ky, vy] of my) {
                    if (eq(kx, ky) && eq(vx, vy)) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    aStack.pop();
                    bStack.pop();
                    return false;
                }
            }
            aStack.pop();
            bStack.pop();
            return true;
        }

        if (xTag === '[object Set]') {
            const sx = Array.from(x as Set<any>);
            const sy = Array.from(y as Set<any>);
            for (const ex of sx) {
                let found = false;
                for (let j = 0; j < sy.length; j++) {
                    if (eq(ex, sy[j])) {
                        sy.splice(j, 1);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    aStack.pop();
                    bStack.pop();
                    return false;
                }
            }
            aStack.pop();
            bStack.pop();
            return true;
        }

        if (ArrayBuffer.isView(x)) {
            const lx = (x as any).length;
            if (lx !== (y as any).length) {
                aStack.pop();
                bStack.pop();
                return false;
            }
            for (let i = 0; i < lx; i++) if ((x as any)[i] !== (y as any)[i]) {
                aStack.pop();
                bStack.pop();
                return false;
            }
            aStack.pop();
            bStack.pop();
            return true;
        }

        const keysX = Object.keys(x);
        const keysY = Object.keys(y);
        if (keysX.length !== keysY.length) {
            aStack.pop();
            bStack.pop();
            return false;
        }
        for (const key of keysX) if (!(key in y)) {
            aStack.pop();
            bStack.pop();
            return false;
        }

        const symX = Object.getOwnPropertySymbols(x);
        const symY = Object.getOwnPropertySymbols(y);
        if (symX.length !== symY.length) {
            aStack.pop();
            bStack.pop();
            return false;
        }

        for (const key of keysX) {
            if (!eq(x[key], y[key])) {
                aStack.pop();
                bStack.pop();
                return false;
            }
        }
        for (const s of symX) {
            if (!eq(x[s as any], y[s as any])) {
                aStack.pop();
                bStack.pop();
                return false;
            }
        }

        aStack.pop();
        bStack.pop();
        return true;
    }

    return eq(a, b);
}

export function deleteDeep(data: any, path: string) {
    const clone = cloneDeep(data);
    if (!path || !isString(path)) return clone;
    const paths = path.split('.').filter(Boolean);
    if (!paths.length) return clone;
    const key = paths.shift() as string;
    if (isObject(clone)) {
        if (paths.length) {
            clone[key] = deleteDeep(clone[key], paths.join('.'));
        } else {
            delete clone[key];
        }
        return clone;
    }
    if (isArray(clone)) {
        if (paths.length) {
            clone[key] = deleteDeep(clone[key], paths.join('.'));
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
export function get(obj: any, path: string | Array<string | number> | number, defaultValue?: any): any {
    if (obj == null) return defaultValue;

    const toPath = (p: string | Array<string | number> | number): Array<string | number> => {
        if (Array.isArray(p)) return p as Array<string | number>;
        if (typeof p === 'number') return [p];
        // string
        const str = String(p);
        const res: Array<string | number> = [];
        // regex matches either bracketed parts or dot-separated identifiers
        const re = /\[(?:'([^']*)'|"([^"]*)"|([^'"\]]+))\]|([^.\[\]]+)/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(str)) !== null) {
            const part = m[1] ?? m[2] ?? m[3] ?? m[4];
            if (part === undefined) continue;
            // numeric index -> number
            if (/^-?\d+$/.test(part)) res.push(Number(part));
            else res.push(part);
        }
        return res;
    };

    const keys = toPath(path);
    let cur = obj;
    for (const key of keys) {
        if (cur == null) return defaultValue;
        cur = cur[key as any];
    }
    return cur === undefined ? defaultValue : cur;
}

export function omit<T extends any = any>(obj: T | null | undefined, props: string | Array<string>): Partial<T> {
    if (obj == null) return {} as Partial<T>;
    const keys = Array.isArray(props) ? props : [props];
    // start from a deep clone so we don't mutate input
    let result: any = cloneDeep(obj as any);

    const normalize = (p: string) =>
        String(p)
            // convert bracket notation ['a'] or ["a"] or [0] to .a or .0
            .replace(/\[(?:'([^']*)'|"([^\"]*)"|([^\]]+))\]/g, (_m, g1, g2, g3) => '.' + (g1 ?? g2 ?? g3))
            .replace(/^\./, '');

    for (const k of keys) {
        if (k == null) continue;
        const path = normalize(k);
        if (!path) continue;
        // use deepDelete which returns a cloned structure with the path removed
        result = deleteDeep(result, path);
    }

    return result as Partial<T>;
}


export function insertBetweenImmutable<D = any>(arr: D[], filler: (index: number) => D) {
    const n = arr.length;
    if (n === 0) return [];
    if (n === 1) return [arr[0]]; // 无“中间”可以插入

    const out: D[] = [];
    for (let i = 0; i < n; i++) {
        out.push(arr[i]);
        if (i !== n - 1) out.push(filler(i));
    }
    return out;
}

export function interchangeById<T extends Record<string, any> = any>(
    arr: T[] | (string | number)[],
    idA: string | number,
    idB: string | number,
    idKey = 'id',
): T[] | (string | number)[] {
    // 处理简单值数组（string/number）和对象数组
    const isPrimitive = typeof arr[0] !== 'object' || arr[0] === null;

    const findIndex = (id: string | number) =>
        isPrimitive
            ? (arr as (string | number)[]).indexOf(id)
            : (arr as T[]).findIndex((x) => x[idKey] === id);

    const i = findIndex(idA);
    const j = findIndex(idB);
    if (i === -1 || j === -1 || i === j) return arr.slice(); // 返回浅拷贝（或可直接 return arr）

    const copy = arr.slice();
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    return copy;
}


