import { map, reduce } from 'lodash';
import { ListToTreeSchema, TreeChildren } from '.';
import { isArray, isEmpty, isNull, isNum, isObject, isUndefined } from './type';

function schemaToObj(obj: any, schema?: ListToTreeSchema) {
  if (!isObject(obj) || !schema || !isObject(schema) || isEmpty(schema)) return obj;
  const keys = Object.entries(schema);
  return Object.entries(obj).reduce((a: any, b: [string, any]) => {
    const [key, value] = b;
    const sch = keys.find((k) => k[0] === key);
    if (isArray(sch) && !!sch && !!sch[1]) {
      a[sch[1]] = value;
    }
    return a;
  }, {});
}

export function listToTree<P = any, I = "id", PI = "parentId">(
  list: P[],
  id: I,
  parentId: PI,
  value: any,
  schema?: ListToTreeSchema,
): TreeChildren<P>[] {
  const root = list.filter((l: any) => l[parentId] == value);
  const childrens = list.filter((l: any) => l[parentId] !== value);
  return root.map((r: any) => {
    return {
      ...schemaToObj(r, schema),
      children: listToTree(childrens, id, parentId, r[id], schema)
    }
  })
}

export function enumToList<K = number, V = string>(params: any): [K, V][] {
  if (isEmpty(params)) return [];
  const list: [K, V][] = [];
  for (const key in params) {
    if (isNum(params[key])) list.push([params[key], key as any]);
  }
  return list;
}

export function enumToOptions(params: any = {}) {
  return Object.entries(params).reduce((a: { label: string, value: any }[], b) => {
    return a.concat([{ label: b[0], value: b[1] }]);
  }, [])
}

export function isNotEmpty(data: any) {
  if(isEmpty(data)) return data;
  if(isObject(data)) {
    return reduce(Object.keys(data), (pre, key) => {
      if (isUndefined(data[key]) || isNull(data[key])) return pre;
      if(isObject(data[key]) || isArray(data[key])) {
        pre[key] = isNotEmpty(data[key]);
      } else if (!isEmpty(data[key])) {
        pre[key] = data[key];
      } else {
        return pre;
      }
    }, {});
  }
  if (isArray(data)) {
    return map(data, (item) => {
      if (isObject(item) || isArray(item)) return isNotEmpty(item);
      return item;
    })
  }
  return data;
}