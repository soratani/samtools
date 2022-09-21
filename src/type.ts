import { BaseType } from "./interface";

export function isFunc(func: any): func is Function {
    return typeof func === 'function';
}

export function isArray(arr: any): arr is any[] {
    return Array.isArray(arr);
}

export function isObject(obj: any): boolean {
    return typeof obj === 'object' && !isArray(obj) && !isFunc(obj) && !isNull(obj);
}

export function isString(str: any): str is string {
    return typeof str === 'string';
}

export function isBigint(big: any): big is bigint {
    return typeof big === 'bigint';
}

export function isBoolean(bol: any): bol is boolean {
    return typeof bol === 'boolean';
}

export function isSymbol(sbl: any): sbl is symbol {
    return typeof sbl === 'symbol';
}

export function isNum(num: any): num is number {
    return typeof num === 'number';
}

export function isUndefined(un?: any): un is undefined {
    return typeof un === 'undefined'
}

export function isNull(un?: any): un is null {
    return un === null;
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
    if (isArray(value)) return !value.length;
    if (isObject(value)) return !Object.keys(value).length;
    if (isUndefined(value) || isNull(value)) return true;
    if (isString(value)) return !value;
    return false;
}


