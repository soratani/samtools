import { BaseType } from "./interface";

export function isFunc(func: any): func is Function {
    return Object.prototype.toString.call(func) === '[object Function]'
}

export function isArray(arr: any): arr is any[] {
    return Object.prototype.toString.call(arr) === '[object Array]'
}

export function isObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === '[object Object]'
}

export function isString(str: any): str is string {
    return Object.prototype.toString.call(str) === '[object String]'
}

export function isBigint(big: any): big is bigint {
    return Object.prototype.toString.call(big) === '[object BigInt]'
}

export function isBigInt64Array(big: any): big is bigint {
    return Object.prototype.toString.call(big) === '[object BigInt64Array]'
}

export function isBigUint64Array(big: any): big is bigint {
    return Object.prototype.toString.call(big) === '[object BigUint64Array]'
}

export function isBlob(data: any): data is Blob {
    return Object.prototype.toString.call(data) === '[object Blob]'
}

export function isBuffer(data: any): data is Buffer {
    return Object.prototype.toString.call(data) === '[object Buffer]'
}

export function isFile(data: any): data is File {
    return Object.prototype.toString.call(data) === '[object File]'
}

export function isBoolean(bol: any): bol is boolean {
    return Object.prototype.toString.call(bol) === '[object Boolean]'
}

export function isSymbol(sbl: any): sbl is symbol {
    return Object.prototype.toString.call(sbl) === '[object Symbol]'
}

export function isNum(num: any): num is number {
    return Object.prototype.toString.call(num) === '[object Number]'
}

export function isDate(date: any): date is Date {
    return Object.prototype.toString.call(date) === '[object Date]'
}

export function isRegExp(reg: any): reg is RegExp  {
    return Object.prototype.toString.call(reg) === '[object RegExp]'
}

export function isUndefined(un?: any): un is undefined {
    return Object.prototype.toString.call(un) === '[object Undefined]'
}

export function isNull(un?: any): un is null {
    return Object.prototype.toString.call(un) === '[object Null]'
}

export function isPromise(obj?: any): obj is Promise<any> {
    return Object.prototype.toString.call(obj) === '[object Promise]'
}

export function type(value: any): BaseType {
    if (isString(value)) return "string";
    if (isNum(value)) return "number";
    if (isArray(value)) return "array";
    if (isObject(value)) return 'object';
    if (isFunc(value)) return 'function';
    if (isSymbol(value)) return 'symbol';
    if (isUndefined(value)) return 'undefined';
    if (isNull(value)) return "null";
    if (isBigint(value)) return "bigint";
    if (isBoolean(value)) return 'boolean';
    return "undefined";
}

export function isEmpty(value: any) {
    if (isUndefined(value) || isNull(value)) return false;
    if (isArray(value)) return !value.length;
    if (isObject(value)) return !Object.keys(value).length;
    if (isString(value)) return !value;
    return false;
}


