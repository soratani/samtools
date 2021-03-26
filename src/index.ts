import { BaseType, TreeChildren } from "./interface";

export function isFunc(func: any): boolean {
  return typeof func === 'function';
}

export function isArray(arr: any): boolean {
  return Array.isArray(arr);
}

export function isObject(obj: any): boolean {
  return typeof obj === 'object' && !isArray(obj) && !isFunc(obj);
}

export function isString(str: any): boolean {
  return typeof str === 'string';
}

export function isBigint(big: any): boolean {
  return typeof big === 'bigint';
}

export function isBoolean(bol: any): boolean {
  return typeof bol === 'boolean';
}

export function isSymbol(sbl: any): boolean {
  return typeof sbl === 'symbol';
}

export function isNum(num: number): boolean {
  return typeof num === 'number';
}

export function isUndefined(un?: any): boolean {
  return typeof un === 'undefined'
}

export function isNull(un?: any) {
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

export function listToTree<P = any, I = "id", PI = "parentId">(list: P[], id: I, parentId: PI, value: any): TreeChildren<P>[] {
  const root = list.filter((l: any) => l[parentId] === value);
  const childrens = list.filter((l: any) => l[parentId] !== value);
  return root.map((r: any) => {
    return {
      ...r,
      children: listToTree(childrens, id, parentId, r[id])
    }
  })
}
